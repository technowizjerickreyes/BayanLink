import api from "./api";

export const uploadAttachments = async (files = []) => {
  if (!files.length) {
    return [];
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await api.post("/uploads/attachments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data || [];
};
