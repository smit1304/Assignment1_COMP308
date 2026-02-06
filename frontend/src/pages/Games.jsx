import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as gamesApi from "../api/games";
import { useAuth } from "../context/AuthContext";

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.games && Array.isArray(payload.games)) return payload.games;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Games() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [games, setGames] = useState([]);
  const [mySet, setMySet] = useState(new Set());
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const all = await gamesApi.listAllGames();
      const allArr = normalizeArray(all);
      setGames(allArr);

      // try to fetch library (if logged in)
      try {
        const mine = await gamesApi.getMyCollection();
        const mineArr = normalizeArray(mine);
        setMySet(new Set(mineArr.map((g) => g._id ?? g.id)));
      } catch {
        setMySet(new Set());
      }
    } catch (e) {
      setErr(e.message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return games;
    return games.filter((g) => {
      const hay = `${g.title} ${g.genre} ${g.platform} ${g.developer}`.toLowerCase();
      return hay.includes(s);
    });
  }, [games, q]);

  const onAdd = async (gameId) => {
    if (!user?.userId) return alert("Please login first.");
    setBusyId(gameId);
    try {
      await gamesApi.addToMyCollection({ userId: user.userId, gameId });
      await fetchAll();
    } catch (e) {
      alert(e.message || "Add failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>All Games</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search (title/genre/platform/developer)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <Link to="/library">
          <button type="button">My Library</button>
        </Link>
      </div>

      {loading ? <p>Loading...</p> : null}
      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <ul style={{ paddingLeft: 18 }}>
        {filtered.map((g) => {
          const id = g._id ?? g.id;
          const inMine = mySet.has(id);
          return (
            <li key={id} style={{ marginBottom: 8 }}>
              <b>{g.title}</b>{" "}
              <span style={{ opacity: 0.8 }}>
                ({g.genre} / {g.platform})
              </span>{" "}
              <Link to={`/games/${id}`}>Details</Link>{" "}
              <button
                disabled={!user || inMine || busyId === id}
                onClick={() => onAdd(id)}
                style={{ marginLeft: 8 }}
              >
                {inMine ? "Added" : busyId === id ? "Adding..." : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
