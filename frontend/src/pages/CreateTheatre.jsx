import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-lg border border-[#262B42] bg-[#0E1220] px-3.5 py-2.5 text-sm text-[#E7E9F5] placeholder:text-[#5C6280] outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20";

const labelClass =
  "mb-1.5 block font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]";

const CreateTheatre = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    theatreName: "",
    row: "",
    column: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const totalSeats = Number(form.row || 0) * Number(form.column || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.theatreName || !form.row || !form.column) {
      setError("Theatre name, row, and column are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { theatreName, row, column } = form;

      await axios.post(
        "http://localhost:3002/api/v1/theatre/create-theatre",
        {
          theatreName,
          row: Number(row),
          column: Number(column),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Theatre created");
      navigate("/create-show");
    } catch (err) {
      console.log(err.message);
      setError(err?.response?.data?.message || "Failed to create theatre");
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
        <h1 className="mb-6 mt-1 text-3xl font-bold">Create theatre</h1>

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
              <label className={labelClass}>Theatre name</label>
              <input
                type="text"
                name="theatreName"
                value={form.theatreName}
                onChange={handleChange}
                placeholder="PVR Orion Mall"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Rows</label>
              <input
                type="number"
                name="row"
                value={form.row}
                onChange={handleChange}
                min="1"
                max="26"
                placeholder="6"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Columns (seats per row)</label>
              <input
                type="number"
                name="column"
                value={form.column}
                onChange={handleChange}
                min="1"
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mm-tear mt-6 flex items-center justify-between pt-4 font-mono-tix text-xs text-[#8A90A8]">
            <span>Seat grid preview</span>
            <span className="text-[#E7E9F5]">
              {form.row || 0} × {form.column || 0} ={" "}
              <span className="text-[#F5B942] font-bold">{totalSeats} seats</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-[#7C5CFC] py-3 font-mono-tix text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#8F72FF] disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create theatre"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTheatre;