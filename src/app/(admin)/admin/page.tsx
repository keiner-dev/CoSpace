"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface SpaceAdminItem {
  id: string;
  name: string;
  description: string;
  type: "DESK" | "MEETING_ROOM" | "BOOTH";
  capacity: number;
  hourlyPrice: number | string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminPage() {
  const [spaces, setSpaces] = useState<SpaceAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Formulario de creación
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formType, setFormType] = useState<"DESK" | "MEETING_ROOM" | "BOOTH">("DESK");
  const [formCapacity, setFormCapacity] = useState<number>(1);
  const [formHourlyPrice, setFormHourlyPrice] = useState<number>(10);
  const [formImageUrl, setFormImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80"
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Estado para Edición de Espacio
  const [editingSpace, setEditingSpace] = useState<SpaceAdminItem | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editType, setEditType] = useState<"DESK" | "MEETING_ROOM" | "BOOTH">("DESK");
  const [editCapacity, setEditCapacity] = useState<number>(1);
  const [editHourlyPrice, setEditHourlyPrice] = useState<number>(10);
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Carga asíncrona de espacios
  useEffect(() => {
    let ignore = false;

    fetch("/api/spaces?all=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.data) {
          setSpaces(data.data);
        }
      })
      .catch(() => {
        if (!ignore) setMessage({ type: "error", text: "Error al cargar espacios." });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // Abrir modal con los datos actuales del espacio a editar
  const handleOpenEdit = (space: SpaceAdminItem) => {
    setEditingSpace(space);
    setEditName(space.name);
    setEditDescription(space.description);
    setEditType(space.type);
    setEditCapacity(space.capacity);
    setEditHourlyPrice(Number(space.hourlyPrice));
    setEditImageUrl(space.imageUrl);
    setEditError(null);
  };

  // Guardar cambios de edición (PUT /api/spaces/[id])
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpace) return;

    setUpdating(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/spaces/${editingSpace.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          type: editType,
          capacity: Number(editCapacity),
          hourlyPrice: Number(editHourlyPrice),
          imageUrl: editImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEditError(data.error || "No se pudo actualizar el espacio.");
      } else {
        setMessage({
          type: "success",
          text: `Espacio "${editName}" actualizado exitosamente.`,
        });
        setEditingSpace(null);
        setReloadKey((prev) => prev + 1);
      }
    } catch {
      setEditError("Error de conexión al guardar los cambios.");
    } finally {
      setUpdating(false);
    }
  };

  // Activar / desactivar espacio (Regla 13: 409 si tiene reservas futuras)
  const handleToggleStatus = async (space: SpaceAdminItem) => {
    setMessage(null);
    const newStatus = !space.isActive;

    try {
      const res = await fetch(`/api/spaces/${space.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "No se pudo cambiar el estado del espacio." });
      } else {
        setMessage({
          type: "success",
          text: `Espacio "${space.name}" ${newStatus ? "activado" : "desactivado"} correctamente.`,
        });
        setReloadKey((prev) => prev + 1);
      }
    } catch {
      setMessage({ type: "error", text: "Error de red al actualizar el espacio." });
    }
  };

  // Crear espacio (POST /api/spaces)
  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          type: formType,
          capacity: Number(formCapacity),
          hourlyPrice: Number(formHourlyPrice),
          imageUrl: formImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Error al crear espacio." });
      } else {
        setMessage({ type: "success", text: "Espacio creado exitosamente." });
        setShowForm(false);
        setFormName("");
        setFormDescription("");
        setReloadKey((prev) => prev + 1);
      }
    } catch {
      setMessage({ type: "error", text: "Error al conectar con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            Administración de Espacios
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Crea, edita, actualiza y gestiona la disponibilidad de los espacios de coworking.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
        >
          {showForm ? "Cancelar Creación" : "+ Crear Nuevo Espacio"}
        </button>
      </div>

      {/* Alertas globales */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Formulario de Creación */}
      {showForm && (
        <form
          onSubmit={handleCreateSpace}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">
              Nuevo Espacio de Coworking
            </h3>
            <p className="text-xs text-zinc-500">
              Completa los datos para publicar un nuevo espacio en el catálogo.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Nombre</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              placeholder="Ej: Hot Desk Premium"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Tipo de Espacio</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as "DESK" | "MEETING_ROOM" | "BOOTH")}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <option value="DESK">Escritorio (DESK)</option>
              <option value="BOOTH">Cabina (BOOTH)</option>
              <option value="MEETING_ROOM">Sala de Juntas (MEETING_ROOM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Capacidad (personas)</label>
            <input
              type="number"
              min="1"
              value={formCapacity}
              onChange={(e) => setFormCapacity(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Precio por Hora ($)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={formHourlyPrice}
              onChange={(e) => setFormHourlyPrice(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">URL de Imagen</label>
            <input
              type="url"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              required
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Descripción</label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              required
              placeholder="Describe el equipamiento y comodidades del espacio..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar Espacio"}
            </button>
          </div>
        </form>
      )}

      {/* Tabla de Espacios */}
      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-sm animate-pulse">Cargando catálogo administrativo...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Espacio</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Capacidad</th>
                <th className="py-3.5 px-4">Precio/Hora</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {spaces.map((sp) => (
                <tr key={sp.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      <Image src={sp.imageUrl} alt={sp.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white line-clamp-1">{sp.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{sp.description}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {sp.type}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-600 dark:text-zinc-400">
                    {sp.capacity} pers.
                  </td>
                  <td className="py-3.5 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    ${Number(sp.hourlyPrice).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sp.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {sp.isActive ? "ACTIVO" : "DESACTIVADO"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => handleOpenEdit(sp)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition border border-zinc-200 dark:border-zinc-700"
                      >
                        Editar
                      </button>

                      {/* Botón Activar / Desactivar */}
                      <button
                        onClick={() => handleToggleStatus(sp)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          sp.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                        }`}
                      >
                        {sp.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edición de Espacio */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Editar Espacio de Coworking
                </h2>
                <p className="text-xs text-zinc-500">Modifica los detalles del espacio y su imagen</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg font-bold p-1 transition"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Nombre del Espacio
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Tipo de Espacio
                </label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as "DESK" | "MEETING_ROOM" | "BOOTH")}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                >
                  <option value="DESK">Escritorio (DESK)</option>
                  <option value="BOOTH">Cabina Acústica (BOOTH)</option>
                  <option value="MEETING_ROOM">Sala de Juntas (MEETING_ROOM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Capacidad (personas)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Precio por Hora ($)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={editHourlyPrice}
                  onChange={(e) => setEditHourlyPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  URL de Imagen (Unsplash u otro enlace directo)
                </label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                />

                {/* Vista previa en vivo de la foto */}
                {editImageUrl && (
                  <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={editImageUrl}
                      alt="Vista previa de la imagen"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold">
                      Vista previa de imagen
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-indigo-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSpace(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition"
                >
                  {updating ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}