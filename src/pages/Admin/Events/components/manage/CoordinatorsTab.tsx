import { FormEvent, useState } from "react";
import {
  useAddCoords,
  useDeleteAllCoords,
  useDeleteCoord,
  useEventCoords,
  useUpdateCoord,
} from "@/features/events/hooks/useEventManagement";
import { getErrorMessage } from "../../utils";
import ConfirmButton from "./ConfirmButton";

interface CoordinatorsTabProps {
  eventId: number;
}

interface Draft {
  name: string;
  role: string;
}

const EMPTY_DRAFT: Draft = { name: "", role: "" };

export default function CoordinatorsTab({ eventId }: CoordinatorsTabProps) {
  const { data: coords = [], isLoading, isError, error, refetch } =
    useEventCoords(eventId);

  const addMutation = useAddCoords(eventId);
  const updateMutation = useUpdateCoord(eventId);
  const deleteMutation = useDeleteCoord(eventId);
  const deleteAllMutation = useDeleteAllCoords(eventId);

  const [newCoord, setNewCoord] = useState<Draft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);
  const [actionError, setActionError] = useState<string | null>(null);

  const busy =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    deleteAllMutation.isPending;

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    setActionError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err, fallback));
      return false;
    }
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const name = newCoord.name.trim();
    const role = newCoord.role.trim();
    if (!name || !role) {
      setActionError("Both name and role are required.");
      return;
    }
    const ok = await run(
      () => addMutation.mutateAsync({ list: [{ name, role }] }),
      "Couldn't add the coordinator.",
    );
    if (ok) setNewCoord(EMPTY_DRAFT);
  };

  const startEdit = (id: number, draft: Draft) => {
    setActionError(null);
    setEditingId(id);
    setEditDraft(draft);
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    const name = editDraft.name.trim();
    const role = editDraft.role.trim();
    if (!name || !role) {
      setActionError("Both name and role are required.");
      return;
    }
    const ok = await run(
      () => updateMutation.mutateAsync({ coordId: editingId, name, role }),
      "Couldn't update the coordinator.",
    );
    if (ok) setEditingId(null);
  };

  return (
    <div>
      <form className="ev-inline-form" onSubmit={handleAdd} noValidate>
        <input
          className="ev-input"
          placeholder="Name"
          aria-label="Coordinator name"
          value={newCoord.name}
          onChange={(e) => setNewCoord({ ...newCoord, name: e.target.value })}
        />
        <input
          className="ev-input"
          placeholder="Role (e.g. Lead)"
          aria-label="Coordinator role"
          value={newCoord.role}
          onChange={(e) => setNewCoord({ ...newCoord, role: e.target.value })}
        />
        <button
          type="submit"
          className="ev-btn ev-btn--primary"
          disabled={busy}
        >
          {addMutation.isPending ? "Adding…" : "Add"}
        </button>
      </form>

      {actionError && <p className="ev-error">{actionError}</p>}

      {isLoading ? (
        <ul className="ev-list" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="ev-list__item">
              <span className="ev-skeleton" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="ev-state">
          <p className="ev-error">
            {getErrorMessage(error, "Couldn't load coordinators.")}
          </p>
          <button type="button" className="ev-btn" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : coords.length === 0 ? (
        <p className="ev-muted ev-empty">No coordinators assigned yet.</p>
      ) : (
        <>
          <ul className="ev-list">
            {coords.map((coord) =>
              editingId === coord.id ? (
                <li key={coord.id} className="ev-list__item">
                  <form
                    className="ev-inline-form ev-inline-form--flush"
                    onSubmit={saveEdit}
                    noValidate
                  >
                    <input
                      className="ev-input"
                      aria-label="Coordinator name"
                      value={editDraft.name}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, name: e.target.value })
                      }
                      autoFocus
                    />
                    <input
                      className="ev-input"
                      aria-label="Coordinator role"
                      value={editDraft.role}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, role: e.target.value })
                      }
                    />
                    <div className="ev-list__actions">
                      <button
                        type="submit"
                        className="ev-btn ev-btn--small ev-btn--primary"
                        disabled={busy}
                      >
                        {updateMutation.isPending ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        className="ev-btn ev-btn--small"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </li>
              ) : (
                <li key={coord.id} className="ev-list__item">
                  <div className="ev-list__main">
                    <span className="ev-list__title">{coord.name}</span>
                    <span className="ev-badge">{coord.role}</span>
                  </div>
                  <div className="ev-list__actions">
                    <button
                      type="button"
                      className="ev-btn ev-btn--small"
                      disabled={busy}
                      onClick={() =>
                        startEdit(coord.id, {
                          name: coord.name,
                          role: coord.role,
                        })
                      }
                    >
                      Edit
                    </button>
                    <ConfirmButton
                      label="Remove"
                      disabled={busy}
                      onConfirm={() =>
                        run(
                          () => deleteMutation.mutateAsync(coord.id),
                          "Couldn't remove the coordinator.",
                        )
                      }
                    />
                  </div>
                </li>
              ),
            )}
          </ul>

          <div className="ev-tab-footer">
            <ConfirmButton
              label="Remove all coordinators"
              confirmLabel="Yes, remove all"
              disabled={busy}
              onConfirm={() =>
                run(
                  () => deleteAllMutation.mutateAsync(),
                  "Couldn't remove the coordinators.",
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
