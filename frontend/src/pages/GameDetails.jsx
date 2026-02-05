import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as gamesApi from "../api/games";
import { useAuth } from "../context/AuthContext";

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.games && Array.isArray(payload.games)) return payload.games;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function GameDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [game, setGame] = useState(null);
  const [inMine, setInMine] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setErr("");
    try {
      const g = await gamesApi.getGameById(id);
      setGame(g?.game ?? g);

      try {
        const mine = await gamesApi.getMyCollection();
        const mineArr = normalizeArray(mine);
        const s = new Set(mineArr.map((x) => x._id ?? x.id));
        setInMine(s.has(id));
      } catch {
        setInMine(false);
      }
    } catch (e) {
      setErr(e.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const onAdd = async () => {
    if (!user?.userId) return alert("Please login first.");
    setBusy(true);
    try {
      await gamesApi.addToMyCollection({ userId: user.userId, gameId: id });
      await refresh();
    } catch (e) {
      alert(e.message || "Add failed");
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async () => {
    setBusy(true);
    try {
      await gamesApi.removeFromMyCollection(id);
      await refresh();
    } catch (e) {
      alert(e.message || "Remove failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (err) return <p style={{ padding: 20, color: "crimson" }}>{err}</p>;
  if (!game) return <p style={{ padding: 20 }}>Game not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <p>
        <Link to="/games">← Back</Link>
      </p>

      <h1>{game.title}</h1>
      <p style={{ opacity: 0.8 }}>
        {game.genre} | {game.platform} | {game.releaseYear}
      </p>

      <p><b>Developer:</b> {game.developer}</p>
      <p><b>Rating:</b> {game.rating ?? "N/A"}</p>
      <p><b>Description:</b> {game.description ?? "—"}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button disabled={!user || inMine || busy} onClick={onAdd}>
          {inMine ? "Added" : busy ? "Working..." : "Add to My Library"}
        </button>
        <button disabled={!user || !inMine || busy} onClick={onRemove}>
          {busy ? "Working..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
