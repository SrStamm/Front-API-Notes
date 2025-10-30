import Fetch from "../utils/api";

export async function fetchPersonalNotes() {
  return await Fetch({
    path: "notes/personal/",
    method: "GET",
  });
}

export async function fetchDeletePersonalNote(noteId: number) {
  return await Fetch({
    path: `notes/${noteId}`,
    method: "DELETE",
  });
}
