import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-lg border border-[#262B42] bg-[#0E1220] px-3.5 py-2.5 text-sm text-[#E7E9F5] placeholder:text-[#5C6280] outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20";

const labelClass =
  "mb-1.5 block font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]";

const rowLetter = (i) => String.fromCharCode(65 + i); // 0 -> A, 1 -> B, ...

const CreateShow = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [form, setForm] = useState({
    movie: "",
    theatre: "",
    showDate: "",
    showTime: "",
    price: "",
    rows: 6,
    seatsPerRow: 10,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [moviesRes, theatresRes] = await Promise.all([
          axios.get("http://localhost:3002/api/v1/movies/get-all-movies"),
          axios.get("http://localhost:3002/api/v1/theatre/get-all-theatres"),
        ]);
        setMovies(moviesRes.data || []);
        setTheatres(theatresRes.data || []);
      } catch (err) {
        console.log(err.message);
        toast.error("Could not load movies/theatres");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const showDay = useMemo(() => {
    if (!form.showDate) return "";
    return new Date(form.showDate).toLocaleDateString("en-IN", { weekday: "long" });
  }, [form.showDate]);

  const totalSeats = Number(form.rows || 0) * Number(form.seatsPerRow || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildSeatMap = () => {
    const rows = Number(form.rows);
    const seatsPerRow = Number(form.seatsPerRow);
    const price = Number(form.price);
    const seats = [];

    for (let r = 0; r < rows; r++) {
      const row = rowLetter(r);
      for (let s = 1; s <= seatsPerRow; s++) {
        seats.push({
          seatNumber: `${row}${s}`,
          row,
          category: "Standard",
          price,
          status: "available",
        });
      }
    }
    return seats;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.movie || !form.theatre || !form.showDate || !form.showTime || !form.price) {
      setError("Movie, theatre, date, time, and price are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "http://localhost:3002/api/v1/show/create-show",
        {
          movie: form.movie,
          theatre: form.theatre,
          showDate: form.showDate,
          showDay,
          showTime: form.showTime,
          price: Number(form.price),
          seatsAvailable: buildSeatMap(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Show created");
      navigate("/all-movies");
    } catch (err) {
      console.log(err.message);
      setError(err?.response?.data?.message || "Failed to create show");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E1A] py-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-2xl px-4">
        <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
          Admin
        </span>
        <h1 className="mb-6 mt-1 text-3xl font-bold">Create show</h1>

        {loadingOptions && (
          <p className="mb-4 font-mono-tix text-sm text-[#8A90A8]">Loading movies and theatres…</p>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 p-4 text-sm text-[#FB7185]">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mm-ticket-corner rounded-2xl border border-[#262B42] bg-[#141827] p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Movie</label>
              <select name="movie" value={form.movie} onChange={handleChange} className={inputClass}>
                <option value="">Select a movie</option>
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name || m.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Theatre</label>
              <select name="theatre" value={form.theatre} onChange={handleChange} className={inputClass}>
                <option value="">Select a theatre</option>
                {theatres.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.theatreName} {t.city ? `· ${t.city}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Show date</label>
              <input
                type="date"
                name="showDate"
                value={form.showDate}
                onChange={handleChange}
                className={inputClass}
              />
              {showDay && (
                <p className="mt-1 font-mono-tix text-[11px] text-[#5C6280]">{showDay}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Show time</label>
              <input
                type="time"
                name="showTime"
                value={form.showTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Ticket price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="1"
                placeholder="250"
                className={inputClass}
              />
            </div>

            <div />

            <div>
              <label className={labelClass}>Rows</label>
              <input
                type="number"
                name="rows"
                value={form.rows}
                onChange={handleChange}
                min="1"
                max="26"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Seats per row</label>
              <input
                type="number"
                name="seatsPerRow"
                value={form.seatsPerRow}
                onChange={handleChange}
                min="1"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mm-tear mt-6 flex items-center justify-between pt-4 font-mono-tix text-xs text-[#8A90A8]">
            <span>Seat map preview</span>
            <span className="text-[#E7E9F5]">
              {form.rows || 0} rows × {form.seatsPerRow || 0} seats ={" "}
              <span className="text-[#F5B942] font-bold">{totalSeats} seats</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingOptions}
            className="mt-6 w-full rounded-lg bg-[#7C5CFC] py-3 font-mono-tix text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#8F72FF] disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create show"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShow;