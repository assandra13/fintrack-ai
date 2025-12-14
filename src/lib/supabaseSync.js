/**
 * Supabase Data Sync Helper
 * Handles real-time sync between cloud and local storage
 */

import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEYS = {
  TRANSACTIONS: "fintrack-transactions",
  WALLETS: "fintrack-wallets",
  CATEGORIES: "fintrack-categories",
  BUDGETS: "fintrack-budgets",
  GOALS: "fintrack-goals",
  BILLS: "fintrack-bills",
};

/**
 * Sync local data to Supabase cloud
 * Called after any data change
 */
export async function syncToCloud(userId, dataType, data) {
  if (!isSupabaseConfigured() || !userId) {
    console.log("Supabase not configured or no user - skipping cloud sync");
    return;
  }

  try {
    const { error } = await supabase.from("user_data").upsert(
      {
        user_id: userId,
        data_type: dataType,
        data: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,data_type" }
    );

    if (error) throw error;
    console.log(`✓ Synced ${dataType} to cloud`);
  } catch (error) {
    console.error(`Failed to sync ${dataType} to cloud:`, error);
  }
}

/**
 * Load data from Supabase cloud
 * Used during app initialization
 */
export async function loadFromCloud(userId) {
  if (!isSupabaseConfigured() || !userId) {
    console.log("Supabase not configured or no user - loading from localStorage only");
    return null;
  }

  try {
    const { data, error } = await supabase.from("user_data").select("*").eq("user_id", userId);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("No cloud data found, using localStorage");
      return null;
    }

    console.log("✓ Loaded cloud data for user", userId);
    return data;
  } catch (error) {
    console.error("Failed to load data from cloud:", error);
    return null;
  }
}

/**
 * Subscribe to real-time changes from other devices
 * Triggers callback when data changes in cloud
 */
export function subscribeToCloudChanges(userId, onDataChange) {
  if (!isSupabaseConfigured() || !userId) {
    console.log("Supabase not configured - no real-time sync");
    return null;
  }

  const subscription = supabase
    .channel(`user_data:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_data",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Real-time update from cloud:", payload);
        onDataChange(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

/**
 * Merge cloud data with local data
 * For conflict resolution (cloud wins)
 */
export function mergeData(localData, cloudData) {
  if (!cloudData) return localData;

  // Cloud timestamp is newer, use cloud data
  const localTime = localData?.updated_at ? new Date(localData.updated_at).getTime() : 0;
  const cloudTime = cloudData.updated_at ? new Date(cloudData.updated_at).getTime() : 0;

  if (cloudTime > localTime) {
    console.log("Using cloud data (newer)");
    return cloudData.data;
  }

  console.log("Using local data (newer or same)");
  return localData;
}

/**
 * Clear cloud data for a user
 * Used for logout or data reset
 */
export async function clearCloudData(userId) {
  if (!isSupabaseConfigured() || !userId) {
    return;
  }

  try {
    const { error } = await supabase.from("user_data").delete().eq("user_id", userId);

    if (error) throw error;
    console.log("✓ Cloud data cleared");
  } catch (error) {
    console.error("Failed to clear cloud data:", error);
  }
}
