export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: { created_at: string; email: string; id: string; message: string; name: string }
        Insert: { created_at?: string; email: string; id?: string; message: string; name: string }
        Update: { created_at?: string; email?: string; id?: string; message?: string; name?: string }
        Relationships: []
      }
      profiles: {
        Row: { email: string; name: string; streak_count: number; accumulated_ms: number; last_tick: number; last_streak_date: string; created_at: string; updated_at: string; user_id: string | null; clerk_user_id: string | null }
        Insert: { email: string; name: string; streak_count?: number; accumulated_ms?: number; last_tick?: number; last_streak_date?: string; created_at?: string; updated_at?: string; user_id?: string | null; clerk_user_id?: string | null }
        Update: { email?: string; name?: string; streak_count?: number; accumulated_ms?: number; last_tick?: number; last_streak_date?: string; created_at?: string; updated_at?: string; user_id?: string | null; clerk_user_id?: string | null }
        Relationships: [{ foreignKeyName: "profiles_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      prize: {
        Row: { id: number; winner_email: string | null; claimed_at: string | null }
        Insert: { id?: number; winner_email?: string | null; claimed_at?: string | null }
        Update: { id?: number; winner_email?: string | null; claimed_at?: string | null }
        Relationships: [{ foreignKeyName: "prize_winner_email_fkey", columns: ["winner_email"], referencedRelation: "profiles", referencedColumns: ["email"] }]
      }
      presence: {
        Row: { id: string; email: string; name: string; start_at: string; last_active: string; active: boolean }
        Insert: { id: string; email: string; name: string; start_at: string; last_active: string; active: boolean }
        Update: { id?: string; email?: string; name?: string; start_at?: string; last_active?: string; active?: boolean }
        Relationships: []
      }
      sessions: {
        Row: { id: string; email: string; name: string; start_at: string; end_at: string; duration_ms: number }
        Insert: { id: string; email: string; name: string; start_at: string; end_at: string; duration_ms: number }
        Update: { id?: string; email?: string; name?: string; start_at?: string; end_at?: string; duration_ms?: number }
        Relationships: []
      }
      user_settings: {
        Row: { user_id: string; lang: string; theme: string; notification_categories: string[]; premium_tier: string; premium_activated_at: string | null; onboarding_done: boolean; pwa_dismissed: boolean; pwa_installed: boolean; whats_new_seen: boolean; created_at: string; updated_at: string }
        Insert: { user_id: string; lang?: string; theme?: string; notification_categories?: string[]; premium_tier?: string; premium_activated_at?: string | null; onboarding_done?: boolean; pwa_dismissed?: boolean; pwa_installed?: boolean; whats_new_seen?: boolean; created_at?: string; updated_at?: string }
        Update: { user_id?: string; lang?: string; theme?: string; notification_categories?: string[]; premium_tier?: string; premium_activated_at?: string | null; onboarding_done?: boolean; pwa_dismissed?: boolean; pwa_installed?: boolean; whats_new_seen?: boolean; created_at?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "user_settings_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      gamification: {
        Row: { user_id: string; points: number; unlocked_badges: string[]; total_water_cups: number; total_expenses_count: number; total_challenges_done: number; breathing_done: number; gratitude_done: number; updated_at: string }
        Insert: { user_id: string; points?: number; unlocked_badges?: string[]; total_water_cups?: number; total_expenses_count?: number; total_challenges_done?: number; breathing_done?: number; gratitude_done?: number; updated_at?: string }
        Update: { user_id?: string; points?: number; unlocked_badges?: string[]; total_water_cups?: number; total_expenses_count?: number; total_challenges_done?: number; breathing_done?: number; gratitude_done?: number; updated_at?: string }
        Relationships: [{ foreignKeyName: "gamification_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      streaks: {
        Row: { user_id: string; count: number; last_day: string | null; freeze_used: boolean; freeze_count: number; updated_at: string }
        Insert: { user_id: string; count?: number; last_day?: string | null; freeze_used?: boolean; freeze_count?: number; updated_at?: string }
        Update: { user_id?: string; count?: number; last_day?: string | null; freeze_used?: boolean; freeze_count?: number; updated_at?: string }
        Relationships: [{ foreignKeyName: "streaks_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      daily_entries: {
        Row: { id: string; user_id: string; date_key: string; tracker_type: string; value: number; updated_at: string }
        Insert: { id?: string; user_id: string; date_key: string; tracker_type: string; value: number; updated_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; tracker_type?: string; value?: number; updated_at?: string }
        Relationships: [{ foreignKeyName: "daily_entries_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      expenses: {
        Row: { id: string; user_id: string; date_key: string; amount: number; category: string; note: string | null; ts: number; created_at: string }
        Insert: { id?: string; user_id: string; date_key: string; amount: number; category: string; note?: string | null; ts: number; created_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; amount?: number; category?: string; note?: string | null; ts?: number; created_at?: string }
        Relationships: [{ foreignKeyName: "expenses_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      big3_entries: {
        Row: { id: string; user_id: string; date_key: string; item1: string | null; item2: string | null; item3: string | null; done1: boolean; done2: boolean; done3: boolean; updated_at: string }
        Insert: { id?: string; user_id: string; date_key: string; item1?: string | null; item2?: string | null; item3?: string | null; done1?: boolean; done2?: boolean; done3?: boolean; updated_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; item1?: string | null; item2?: string | null; item3?: string | null; done1?: boolean; done2?: boolean; done3?: boolean; updated_at?: string }
        Relationships: [{ foreignKeyName: "big3_entries_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      journal_entries: {
        Row: { id: string; user_id: string; date_key: string; journal_type: string; content: string; created_at: string }
        Insert: { id?: string; user_id: string; date_key: string; journal_type: string; content: string; created_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; journal_type?: string; content?: string; created_at?: string }
        Relationships: [{ foreignKeyName: "journal_entries_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      screens_off: {
        Row: { id: string; user_id: string; date_key: string; value: boolean; updated_at: string }
        Insert: { id?: string; user_id: string; date_key: string; value?: boolean; updated_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; value?: boolean; updated_at?: string }
        Relationships: [{ foreignKeyName: "screens_off_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      goals: {
        Row: { id: string; user_id: string; title: string; category: string; target: number; current: number; unit: string; created_at: string }
        Insert: { id?: string; user_id: string; title: string; category: string; target: number; current?: number; unit: string; created_at?: string }
        Update: { id?: string; user_id?: string; title?: string; category?: string; target?: number; current?: number; unit?: string; created_at?: string }
        Relationships: [{ foreignKeyName: "goals_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      challenge_records: {
        Row: { id: string; user_id: string; date_key: string; done: boolean; updated_at: string }
        Insert: { id?: string; user_id: string; date_key: string; done?: boolean; updated_at?: string }
        Update: { id?: string; user_id?: string; date_key?: string; done?: boolean; updated_at?: string }
        Relationships: [{ foreignKeyName: "challenge_records_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      favorites: {
        Row: { user_id: string; recipe_ids: string[]; updated_at: string }
        Insert: { user_id: string; recipe_ids?: string[]; updated_at?: string }
        Update: { user_id?: string; recipe_ids?: string[]; updated_at?: string }
        Relationships: [{ foreignKeyName: "favorites_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      plans: {
        Row: { id: string; user_id: string; plan_id: string; started_at: string; completed_days: number[]; created_at: string }
        Insert: { id?: string; user_id: string; plan_id: string; started_at: string; completed_days?: number[]; created_at?: string }
        Update: { id?: string; user_id?: string; plan_id?: string; started_at?: string; completed_days?: number[]; created_at?: string }
        Relationships: [{ foreignKeyName: "plans_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      ai_chat_messages: {
        Row: { id: string; user_id: string; role: string; content: string; created_at: string }
        Insert: { id?: string; user_id: string; role: string; content: string; created_at?: string }
        Update: { id?: string; user_id?: string; role?: string; content?: string; created_at?: string }
        Relationships: [{ foreignKeyName: "ai_chat_messages_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      analytics_events: {
        Row: { id: string; user_id: string; event_name: string; properties: Json | null; ts: number; created_at: string }
        Insert: { id?: string; user_id: string; event_name: string; properties?: Json | null; ts: number; created_at?: string }
        Update: { id?: string; user_id?: string; event_name?: string; properties?: Json | null; ts?: number; created_at?: string }
        Relationships: [{ foreignKeyName: "analytics_events_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
      admin_items: {
        Row: { id: string; user_id: string; item_type: string; data: Json; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; item_type: string; data: Json; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; item_type?: string; data?: Json; created_at?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "admin_items_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Helper base types for Supabase storage operations
export interface SyncTable<T extends Record<string, unknown>> {
  toRow(data: Partial<T> & { user_id: string }): Record<string, unknown>
  fromRow(row: Record<string, unknown>): T
  tableName: string
  conflictColumn?: string
}
