export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      inquiries: {
        Row: {
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          kind: string
          message: string | null
          name: string
          notified_at: string | null
          phone: string | null
          preferred_date: string | null
          preferred_slot: string | null
          privacy_notice_version: string
          status: Database["public"]["Enums"]["lead_status"]
          topic: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          kind: string
          message?: string | null
          name: string
          notified_at?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_slot?: string | null
          privacy_notice_version: string
          status?: Database["public"]["Enums"]["lead_status"]
          topic?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          kind?: string
          message?: string | null
          name?: string
          notified_at?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_slot?: string | null
          privacy_notice_version?: string
          status?: Database["public"]["Enums"]["lead_status"]
          topic?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_photo_deletions: {
        Row: {
          created_at: string
          path: string
        }
        Insert: {
          created_at?: string
          path: string
        }
        Update: {
          created_at?: string
          path?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved_at: string | null
          author: string
          id: string
          is_visible: boolean
          rating: number | null
          sort_order: number
          source: string
          text: string
        }
        Insert: {
          approved_at?: string | null
          author: string
          id?: string
          is_visible?: boolean
          rating?: number | null
          sort_order?: number
          source?: string
          text: string
        }
        Update: {
          approved_at?: string | null
          author?: string
          id?: string
          is_visible?: boolean
          rating?: number | null
          sort_order?: number
          source?: string
          text?: string
        }
        Relationships: []
      }
      trade_in_requests: {
        Row: {
          accident_status: string
          brand: string
          condition_exterior: string | null
          condition_interior: string | null
          contact_channel: string | null
          created_at: string
          damage_notes: string | null
          desired_vehicle_id: string | null
          email: string | null
          engine_variant: string | null
          financing_active: boolean | null
          first_name: string
          first_registration_year: number
          fuel: string | null
          hu_until: string | null
          id: string
          intent: string
          internal_notes: string | null
          internal_valuation_eur: number | null
          last_name: string
          marketing_opt_in: boolean
          mileage_km: number
          model: string
          notified_at: string | null
          phone: string | null
          photo_paths: string[]
          previous_owners: string | null
          privacy_notice_version: string
          service_book: string | null
          status: Database["public"]["Enums"]["lead_status"]
          transmission: string | null
          zip: string | null
        }
        Insert: {
          accident_status: string
          brand: string
          condition_exterior?: string | null
          condition_interior?: string | null
          contact_channel?: string | null
          created_at?: string
          damage_notes?: string | null
          desired_vehicle_id?: string | null
          email?: string | null
          engine_variant?: string | null
          financing_active?: boolean | null
          first_name: string
          first_registration_year: number
          fuel?: string | null
          hu_until?: string | null
          id?: string
          intent: string
          internal_notes?: string | null
          internal_valuation_eur?: number | null
          last_name: string
          marketing_opt_in?: boolean
          mileage_km: number
          model: string
          notified_at?: string | null
          phone?: string | null
          photo_paths?: string[]
          previous_owners?: string | null
          privacy_notice_version: string
          service_book?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          transmission?: string | null
          zip?: string | null
        }
        Update: {
          accident_status?: string
          brand?: string
          condition_exterior?: string | null
          condition_interior?: string | null
          contact_channel?: string | null
          created_at?: string
          damage_notes?: string | null
          desired_vehicle_id?: string | null
          email?: string | null
          engine_variant?: string | null
          financing_active?: boolean | null
          first_name?: string
          first_registration_year?: number
          fuel?: string | null
          hu_until?: string | null
          id?: string
          intent?: string
          internal_notes?: string | null
          internal_valuation_eur?: number | null
          last_name?: string
          marketing_opt_in?: boolean
          mileage_km?: number
          model?: string
          notified_at?: string | null
          phone?: string | null
          photo_paths?: string[]
          previous_owners?: string | null
          privacy_notice_version?: string
          service_book?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          transmission?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_in_requests_desired_vehicle_id_fkey"
            columns: ["desired_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          body_type: string
          brand: string
          color: string | null
          cover_index: number | null
          created_at: string
          description: string | null
          envkv_required: boolean
          features: string[]
          first_registration: string
          fuel: Database["public"]["Enums"]["fuel_type"]
          gallery_hidden: number[]
          hover_index: number | null
          hu_until: string | null
          id: string
          image_count: number | null
          images: Json
          is_demo: boolean
          is_highlight: boolean
          mileage_km: number
          mobile_de_id: string | null
          model: string
          power_kw: number | null
          power_ps: number | null
          previous_owners: number | null
          price_eur: number
          seal_indices: number[]
          slug: string
          status: Database["public"]["Enums"]["vehicle_status"]
          tax_status: Database["public"]["Enums"]["tax_status"]
          title: string
          transmission: Database["public"]["Enums"]["gearbox"]
          updated_at: string
          variant: string | null
        }
        Insert: {
          body_type: string
          brand: string
          color?: string | null
          cover_index?: number | null
          created_at?: string
          description?: string | null
          envkv_required?: boolean
          features?: string[]
          first_registration: string
          fuel: Database["public"]["Enums"]["fuel_type"]
          gallery_hidden?: number[]
          hover_index?: number | null
          hu_until?: string | null
          id?: string
          image_count?: number | null
          images?: Json
          is_demo?: boolean
          is_highlight?: boolean
          mileage_km: number
          mobile_de_id?: string | null
          model: string
          power_kw?: number | null
          power_ps?: number | null
          previous_owners?: number | null
          price_eur: number
          seal_indices?: number[]
          slug: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          tax_status?: Database["public"]["Enums"]["tax_status"]
          title: string
          transmission: Database["public"]["Enums"]["gearbox"]
          updated_at?: string
          variant?: string | null
        }
        Update: {
          body_type?: string
          brand?: string
          color?: string | null
          cover_index?: number | null
          created_at?: string
          description?: string | null
          envkv_required?: boolean
          features?: string[]
          first_registration?: string
          fuel?: Database["public"]["Enums"]["fuel_type"]
          gallery_hidden?: number[]
          hover_index?: number | null
          hu_until?: string | null
          id?: string
          image_count?: number | null
          images?: Json
          is_demo?: boolean
          is_highlight?: boolean
          mileage_km?: number
          mobile_de_id?: string | null
          model?: string
          power_kw?: number | null
          power_ps?: number | null
          previous_owners?: number | null
          price_eur?: number
          seal_indices?: number[]
          slug?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          tax_status?: Database["public"]["Enums"]["tax_status"]
          title?: string
          transmission?: Database["public"]["Enums"]["gearbox"]
          updated_at?: string
          variant?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_leads: { Args: never; Returns: Json }
      complete_trade_in_request: {
        Args: {
          _condition_exterior: string
          _condition_interior: string
          _damage_notes: string
          _hu_until: string
          _id: string
          _photo_paths: string[]
          _previous_owners: string
          _service_book: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      fuel_type: "benzin" | "diesel" | "hybrid" | "elektro" | "gas"
      gearbox: "schaltung" | "automatik"
      lead_status:
        | "neu"
        | "kontaktiert"
        | "termin"
        | "angebot"
        | "abgeschlossen"
        | "abgelehnt"
      tax_status: "differenz" | "regel"
      vehicle_status: "verfuegbar" | "reserviert" | "verkauft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      fuel_type: ["benzin", "diesel", "hybrid", "elektro", "gas"],
      gearbox: ["schaltung", "automatik"],
      lead_status: [
        "neu",
        "kontaktiert",
        "termin",
        "angebot",
        "abgeschlossen",
        "abgelehnt",
      ],
      tax_status: ["differenz", "regel"],
      vehicle_status: ["verfuegbar", "reserviert", "verkauft"],
    },
  },
} as const
