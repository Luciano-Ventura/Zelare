"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { calcularDistanciaKm } from "@/lib/geo";

export async function updateStatusProfissional(plantaoId: string, status: string, token: string) {
  const { error } = await supabaseAdmin
    .from("plantoes")
    .update({ status_profissional: status })
    .eq("id", plantaoId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/app/${token}/plantao/${plantaoId}`);
  return { success: true };
}

export async function processCheckIn(plantaoId: string, lat: number, lng: number, familiaLat: number, familiaLng: number, token: string) {
  const distancia = calcularDistanciaKm(lat, lng, familiaLat, familiaLng);
  // 300 metros
  const statusCheckin = distancia <= 0.3 ? "Dentro do raio" : "Fora do raio";

  const { error } = await supabaseAdmin
    .from("plantoes")
    .update({
      checkin_lat: lat,
      checkin_lng: lng,
      checkin_time: new Date().toISOString(),
      checkin_distancia_km: distancia,
      checkin_status: statusCheckin,
      status_profissional: "No local",
    })
    .eq("id", plantaoId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/app/${token}/plantao/${plantaoId}`);
  return { success: true, status: statusCheckin };
}

export async function processCheckOutAndDiario(
  plantaoId: string,
  profissionalId: string,
  lat: number,
  lng: number,
  familiaLat: number,
  familiaLng: number,
  diarioData: any,
  token: string
) {
  const distancia = calcularDistanciaKm(lat, lng, familiaLat, familiaLng);
  const statusCheckout = distancia <= 0.3 ? "Dentro do raio" : "Fora do raio";

  // 1. Atualizar Plantão
  const { error: errPlantao } = await supabaseAdmin
    .from("plantoes")
    .update({
      checkout_lat: lat,
      checkout_lng: lng,
      checkout_time: new Date().toISOString(),
      checkout_distancia_km: distancia,
      checkout_status: statusCheckout,
      status: "Concluído",
      status_profissional: "Finalizado",
    })
    .eq("id", plantaoId);

  if (errPlantao) return { success: false, error: errPlantao.message };

  // Atualizar Repasse Profissional (Financeiro)
  await supabaseAdmin
    .from("repasses_profissionais")
    .update({ status_repasse: "Pronto para repasse" })
    .eq("plantao_id", plantaoId);

  // 2. Inserir Diário de Bordo
  const { error: errDiario } = await supabaseAdmin
    .from("diario_bordo")
    .insert({
      plantao_id: plantaoId,
      profissional_id: profissionalId,
      ...diarioData
    });

  if (errDiario) return { success: false, error: errDiario.message };

  revalidatePath(`/app/${token}`);
  revalidatePath(`/app/${token}/plantao/${plantaoId}`);
  return { success: true };
}
