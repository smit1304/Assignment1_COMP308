import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as gamesApi from "../api/games";

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.games && Array.isArray(payload.games)) return payload.games;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Library() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [mine, setMine] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const fetchMine = async () => {
    setLoading(true);
    setErr("");
    try {
      const payload = await gamesApi.getMyCollection();
      setMine(normalizeArray(payload));
    } catch (e) {
      setErr(e.message || "Failed to load library (are you logged in?)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const onRemove = async (gameId) => {
    setBusyId(gameId);
    try {
      await gamesApi.removeFromMyCollection(gameId);
      await fetchMine();
    } catch (e) {
      alert(e.message || "Remove failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Library</h1>
      <p>
        <Link to="/games">← Back to all games</Link>
      </p>

      {loading ? <p>Loading...</p> : null}
      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
      {mine.length === 0 && !loading && !err ? <p>Your library is empty.</p> : null}

      <ul style={{ paddingLeft: 18 }}>
        {mine.map((g) => {
          const id = g._id ?? g.id;
          return (
            <li key={id} style={{ marginBottom: 8 }}>
              <b>{g.title}</b>{" "}
              <span style={{ opacity: 0.8 }}>
                ({g.genre} / {g.platform})
              </span>{" "}
              <Link to={`/games/${id}`}>Details</Link>{" "}
              <button
                disabled={busyId === id}
                onClick={() => onRemove(id)}
                style={{ marginLeft: 8 }}
              >
                {busyId === id ? "Removing..." : "Remove"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
