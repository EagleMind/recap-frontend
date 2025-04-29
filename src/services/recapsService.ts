import axios from "axios";
import { api } from "./api";

export interface RecapApiModel {
  _id: string;
  title: string;
  description?: string;
  assignedTo: { _id: string; name: string; email: string } | string;
  createdBy: { _id: string; name: string; email: string } | string;
  team: { _id: string; name: string } | string;
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchRecapsApi(params?: { userId?: string; teamId?: string }): Promise<RecapApiModel[]> {
  const res = await api.get("/recaps", { params });
  return res.data;
}

export async function createRecapApi(data: Partial<RecapApiModel>): Promise<RecapApiModel> {
  const res = await api.post("/recaps", data);
  return res.data;
}

export async function updateRecapApi(id: string, data: Partial<RecapApiModel>): Promise<RecapApiModel> {
  const res = await api.put(`/recaps/${id}`, data);
  return res.data;
}

export async function deleteRecapApi(id: string): Promise<void> {
  await api.delete(`/api/recaps/${id}`);
}

