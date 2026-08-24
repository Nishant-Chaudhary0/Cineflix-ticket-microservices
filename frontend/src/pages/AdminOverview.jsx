import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const statusStyle = (status) =>
  status === "success"
    ? "bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30"
    : status === "pending"
    ? "bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30"
    : "bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/30";

const isObj = (v) => v && typeof v === "object";

const getMovieName = (movie) =>
  isObj(movie) ? movie.name || movie.title || "Untitled" : `Movie #${String(movie).slice(-6)}`;

const StatCard = ({ label, value, accent }) => (
  <div className="mm-ticket-corner rounded-2xl border border-[#262B42] bg-[#141827] p-5">
    <p className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">{label}</p>
    <p className="mt-2 text-2xl font-bold text-[#E7E9F5]" style={accent ? { color: accent } : undefined}>
      {value}
    </p>
  </div>
);

const AdminOverview = () => {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const [moviesRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:3002/api/v1/movies/get-all-movies"),
          axios.get("http://localhost:3002/api/v1/bookings/get-all-bookings-by-id", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMovies(moviesRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.log(err.message);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.paymentstatus === "success" ? Number(b.totalPrice || 0) : 0),
      0
    );
    const successCount = bookings.filter((b) => b.paymentstatus === "success").length;
    const pendingCount = bookings.filter((b) => b.paymentstatus === "pending").length;
    const failedCount = bookings.filter((b) => b.paymentstatus === "failed").length;

    return {
      totalMovies: movies.length,
      totalBookings: bookings.length,
      totalRevenue,
      successCount,
      pendingCount,
      failedCount,
    };
  }, [movies, bookings]);

  const revenueByDay = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (b.paymentstatus !== "success") return;
      const day = new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      map[day] = (map[day] || 0) + Number(b.totalPrice || 0);
    });
    const entries = Object.entries(map).slice(-7);
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return { entries, max };
  }, [bookings]);

  const donut = useMemo(() => {
    const total = stats.totalBookings || 1;
    const successPct = (stats.successCount / total) * 100;
    const pendingPct = (stats.pendingCount / total) * 100;
    const failedPct = (stats.failedCount / total) * 100;
    const gradient = `conic-gradient(#22D3EE 0 ${successPct}%, #F5B942 ${successPct}% ${
      successPct + pendingPct
    }%, #FB7185 ${successPct + pendingPct}% ${successPct + pendingPct + failedPct}%)`;
    return { gradient, successPct, pendingPct, failedPct };
  }, [stats]);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0B0E1A] py-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-6xl px-4">
        <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
          Admin
        </span>
        <h1 className="mb-6 mt-1 text-3xl font-bold">Overview</h1>

        {loading && <p className="font-mono-tix text-sm text-[#8A90A8]">Loading dashboard…</p>}

        {error && (
          <div className="mb-6 rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 p-4 text-[#FB7185]">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total movies" value={stats.totalMovies} />
              <StatCard label="Total bookings" value={stats.totalBookings} />
              <StatCard label="Total revenue" value={currency(stats.totalRevenue)} accent="#F5B942" />
              <StatCard label="Pending payments" value={stats.pendingCount} accent="#F5B942" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#262B42] bg-[#141827] p-5 lg:col-span-2">
                <h3 className="mb-4 font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
                  Revenue, last 7 active days
                </h3>
                {revenueByDay.entries.length === 0 ? (
                  <p className="font-mono-tix text-sm text-[#5C6280]">No successful bookings yet.</p>
                ) : (
                  (() => {
                    const w = 640;
                    const h = 160;
                    const padX = 24;
                    const padY = 16;
                    const n = revenueByDay.entries.length;
                    const stepX = n > 1 ? (w - padX * 2) / (n - 1) : 0;
                    const points = revenueByDay.entries.map(([day, amt], i) => {
                      const x = padX + stepX * i;
                      const y = padY + (1 - amt / revenueByDay.max) * (h - padY * 2);
                      return { x, y, day, amt };
                    });
                    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                    const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - padY} L ${points[0].x} ${h - padY} Z`;

                    return (
                      <div>
                        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 180 }}>
                          <defs>
                            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaPath} fill="url(#revFill)" />
                          <path d={linePath} fill="none" stroke="#8F72FF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                          {points.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0B0E1A" stroke="#8F72FF" strokeWidth="2" />
                          ))}
                        </svg>
                        <div className="mt-1 flex justify-between font-mono-tix text-[10px] text-[#5C6280]" style={{ paddingLeft: padX, paddingRight: padX }}>
                          {points.map((p, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <span className="text-[#8A90A8]">{currency(p.amt)}</span>
                              <span className="uppercase">{p.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="rounded-2xl border border-[#262B42] bg-[#141827] p-5">
                <h3 className="mb-4 font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
                  Payment status
                </h3>
                <div className="flex items-center justify-center">
                  <div
                    className="relative h-32 w-32 rounded-full"
                    style={{ background: donut.gradient }}
                  >
                    <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#141827]">
                      <span className="text-lg font-bold">{stats.totalBookings}</span>
                      <span className="font-mono-tix text-[10px] uppercase text-[#5C6280]">bookings</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 font-mono-tix text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#8A90A8]">
                      <span className="h-2 w-2 rounded-full bg-[#22D3EE]" /> Success
                    </span>
                    <span>{stats.successCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#8A90A8]">
                      <span className="h-2 w-2 rounded-full bg-[#F5B942]" /> Pending
                    </span>
                    <span>{stats.pendingCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#8A90A8]">
                      <span className="h-2 w-2 rounded-full bg-[#FB7185]" /> Failed
                    </span>
                    <span>{stats.failedCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#262B42] bg-[#141827] p-5">
              <h3 className="mb-4 font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
                Recent bookings
              </h3>

              {recentBookings.length === 0 ? (
                <p className="font-mono-tix text-sm text-[#5C6280]">No bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left font-mono-tix text-xs">
                    <thead>
                      <tr className="text-[#5C6280]">
                        <th className="pb-3 pr-3 font-normal uppercase tracking-wide">Booking</th>
                        <th className="pb-3 pr-3 font-normal uppercase tracking-wide">Movie</th>
                        <th className="pb-3 pr-3 font-normal uppercase tracking-wide">Date</th>
                        <th className="pb-3 pr-3 font-normal uppercase tracking-wide">Status</th>
                        <th className="pb-3 font-normal uppercase tracking-wide text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b._id} className="mm-tear">
                          <td className="py-3 pr-3 text-[#8A90A8]">#{String(b._id).slice(-6)}</td>
                          <td className="py-3 pr-3 text-[#E7E9F5]">{getMovieName(b.movie)}</td>
                          <td className="py-3 pr-3 text-[#8A90A8]">
                            {new Date(b.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3 pr-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyle(
                                b.paymentstatus
                              )}`}
                            >
                              {b.paymentstatus}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-[#F5B942]">
                            {currency(b.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;