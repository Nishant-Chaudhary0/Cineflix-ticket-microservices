import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const genreOptions = ["Action", "Comedy", "Adventure", "Sci-Fi"];

const inputClass =
  "w-full rounded-lg border border-[#262B42] bg-[#0E1220] px-3.5 py-2.5 text-sm text-[#E7E9F5] placeholder:text-[#5C6280] outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20";

const labelClass =
  "mb-1.5 block font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]";

const CreateMovie = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    releaseDate: "",
    description: "",
    genre: genreOptions[0],
    duration: "",
    language: "",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.releaseDate || !form.duration) {
      setError("Name, release date, and duration are required.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { name, releaseDate, description, genre, duration, language, image } = form;

      await axios.post(
        "http://localhost:3002/api/v1/movies/create-movie",
        {
          name,
          releaseDate,
          description,
          genre,
          duration: Number(duration),
          language,
          image,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Movie created");
      navigate("/all-movies");
    } catch (err) {
      console.log(err.message);
      setError(err?.response?.data?.message || "Failed to create movie");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E1A] py-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-3xl px-4">
        <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
          Admin
        </span>
        <h1 className="mb-6 mt-1 text-3xl font-bold">Create movie</h1>

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
              <label className={labelClass}>Movie name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Inception"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Release date</label>
              <input
                type="date"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min="1"
                placeholder="148"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Genre</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={inputClass}
              >
                {genreOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Language</label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="English"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Poster image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://…"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="A thief who steals corporate secrets…"
                className={inputClass}
              />
            </div>
          </div>

          {form.image && (
            <div className="mm-tear mt-6 flex items-center gap-4 pt-5">
              <img
                src={form.image}
                alt="Poster preview"
                className="h-28 w-20 rounded-lg object-cover border border-[#262B42]"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="font-mono-tix text-xs text-[#5C6280]">Poster preview</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-[#7C5CFC] py-3 font-mono-tix text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#8F72FF] disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create movie"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMovie;