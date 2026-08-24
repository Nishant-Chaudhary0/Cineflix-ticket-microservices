import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

// "Midnight Marquee" theme


const NewBooking = () => {
  const [seats, setSeats] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function getSeats() {
      setLoading(true);
      try {
        const result = await axios.get(
          `http://localhost:3002/api/v1/show/get-show-by-showId/${id}`
        );
        setSeats(result.data);
      } catch (error) {
        console.log(error);
        toast.error('Could not load seats for this show');
      } finally {
        setLoading(false);
      }
    }
    getSeats();
  }, [id]);

  // Group seats by category (falls back gracefully if the API doesn't send one)
  const groups = useMemo(() => {
    const list = seats?.seatsAvailable ?? [];
    const byCategory = {};

    list.forEach((seat) => {
      const category = seat.category || 'Standard';
      const price = seat.price ?? seats?.price ?? 0;
      const rowLabel =
        seat.row || (seat.seatNumber?.match(/^[A-Za-z]+/)?.[0] ?? '—');

      if (!byCategory[category]) byCategory[category] = { price, rows: {} };
      if (!byCategory[category].rows[rowLabel]) byCategory[category].rows[rowLabel] = [];
      byCategory[category].rows[rowLabel].push(seat);
    });

    return Object.entries(byCategory).map(([name, data]) => ({
      name,
      price: data.price,
      rows: Object.entries(data.rows).sort(([a], [b]) => a.localeCompare(b)),
    }));
  }, [seats]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat._id)) next.delete(seat._id);
      else next.add(seat._id);
      return next;
    });
  };

  const selectedSeats = useMemo(() => {
    const list = seats?.seatsAvailable ?? [];
    return list.filter((s) => selected.has(s._id));
  }, [seats, selected]);

  const total = useMemo(() => {
    return groups.reduce((sum, group) => {
      const count = group.rows.reduce(
        (c, [, rowSeats]) => c + rowSeats.filter((s) => selected.has(s._id)).length,
        0
      );
      return sum + count * group.price;
    }, 0);
  }, [groups, selected]);

  const openRazorpay = (order, bookingId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,

      amount: order.amount,

      currency: order.currency,

      order_id: order.id, // or order.id depending on your API response

      name: "CineFlix",

      description: "Movie Ticket Booking",

      handler: async function (response) {
        try {
          await axios.post(
            "http://localhost:3003/v1/api/payments/verify-payment",
            {
              bookingId,
              showId: id,
              seats: selectedSeats.map((s) => s.seatNumber),
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }
          );

          console.log("the curr booking Id", bookingId);
          console.log("the curr booking Id", bookingId);

          console.log("the curr booking Id", bookingId);

          console.log("the curr booking Id", bookingId);
          console.log("the curr booking Id", bookingId);


          toast.success("Payment Successful");
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },

      theme: {
        color: "#7C5CFC",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleBooking = async () => {

    try {
      const booking = await axios.post("http://localhost:3002/api/v1/bookings/create-booking", {
        showId: id,
        seats: selectedSeats.map(s => s.seatNumber)
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const bookingId = booking.data.booking._id;

      const order = await axios.post("http://localhost:3003/v1/api/payments/create-order", {
        bookingId,
        showId: id,
        amount: booking.data.booking.totalPrice
      })

      console.log(order.data);

      openRazorpay(order.data, bookingId);
    } catch (error) {
      toast("error booking movie", error);
      console.log("error booking movie", error);
    }
  }
  return (
    <div className="min-h-screen bg-[#0B0E1A] text-[#E7E9F5] pb-32">
      {/* Glowing screen indicator */}
      <div className="relative flex flex-col items-center pt-10 pb-14">
        <div className="relative w-[70%] max-w-xl h-3">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-70"
            style={{ background: 'linear-gradient(90deg, transparent, #7C5CFC, #22D3EE, #7C5CFC, transparent)' }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #C9BEFF, #A5F3FC, #C9BEFF, transparent)' }}
          />
        </div>
        <span className="mt-3 text-xs tracking-[0.4em] text-[#8A90A8] font-mono uppercase">
          Screen this way
        </span>
      </div>

      {loading && (
        <p className="text-center text-[#8A90A8] font-mono text-sm">Loading seat map…</p>
      )}

      {!loading && groups.length === 0 && (
        <p className="text-center text-[#8A90A8] font-mono text-sm">No seats found for this show.</p>
      )}

      {/* Category groups */}
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        {groups.map((group) => (
          <div
            key={group.name}
            className="bg-[#141827] border border-[#262B42] rounded-2xl p-5 md:p-7"
          >
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="uppercase tracking-widest font-bold text-sm md:text-base text-[#E7E9F5]">
                {group.name}
              </h2>
              <span className="font-mono text-sm text-[#F5B942]">
                ₹{group.price}
              </span>
            </div>

            <div className="space-y-3">
              {group.rows.map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="flex items-center gap-3">
                  <span className="w-5 shrink-0 text-center text-xs font-mono text-[#5C6280]">
                    {rowLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selected.has(seat._id);
                      const isBooked = seat.status !== 'available';
                      return (
                        <button
                          key={seat._id}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seat)}
                          className={[
                            'w-9 h-9 rounded-md font-mono text-xs flex items-center justify-center transition-all duration-150 border',
                            isBooked
                              ? 'bg-[#1A1E2E] border-[#262B42] text-[#3E4358] cursor-not-allowed line-through'
                              : isSelected
                                ? 'bg-[#22D3EE] border-[#22D3EE] text-[#0B0E1A] font-bold shadow-[0_0_12px_2px_rgba(34,211,238,0.6)] -translate-y-0.5'
                                : 'bg-[#1E2436] border-[#2E3550] text-[#C7CBE0] hover:border-[#7C5CFC] hover:-translate-y-0.5',
                          ].join(' ')}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto px-4 mt-8 flex gap-6 text-xs font-mono text-[#8A90A8]">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#1E2436] border border-[#2E3550]" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#22D3EE]" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#1A1E2E] border border-[#262B42]" /> Booked
        </span>
      </div>

      {/* Ticket-stub summary bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto m-4 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-[#141827] border border-[#262B42] border-b-0 flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-xs text-[#8A90A8] font-mono uppercase tracking-wider">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-[#C7CBE0] font-mono mt-0.5">
                  {selectedSeats.map((s) => s.seatNumber).join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8A90A8] font-mono uppercase tracking-wider">Total</p>
                <p className="text-lg font-bold text-[#F5B942] font-mono">₹{total}</p>
              </div>
            </div>
            <button
              className="w-full py-3 bg-[#7C5CFC] hover:bg-[#8F72FF] text-white font-bold uppercase tracking-widest text-sm transition-colors"
              style={{
                borderTop: '2px dashed #0B0E1A',
              }}
              onClick={handleBooking}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBooking;