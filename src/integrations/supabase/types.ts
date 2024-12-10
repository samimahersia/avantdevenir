export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string
          consulate_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          service_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          consulate_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          service_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          consulate_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          service_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_consulate_id_fkey"
            columns: ["consulate_id"]
            isOneToOne: false
            referencedRelation: "consulates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      consulate_holidays: {
        Row: {
          consulate_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          consulate_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          consulate_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consulate_holidays_consulate_id_fkey"
            columns: ["consulate_id"]
            isOneToOne: false
            referencedRelation: "consulates"
            referencedColumns: ["id"]
          },
        ]
      }
      consulate_services: {
        Row: {
          consulate_id: string
          created_at: string
          id: string
          service_id: string
          updated_at: string
        }
        Insert: {
          consulate_id: string
          created_at?: string
          id?: string
          service_id: string
          updated_at?: string
        }
        Update: {
          consulate_id?: string
          created_at?: string
          id?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consulate_services_consulate_id_fkey"
            columns: ["consulate_id"]
            isOneToOne: false
            referencedRelation: "consulates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consulate_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      consulates: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          timezone: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          sent_at: string | null
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          push_enabled: boolean | null
          reminder_before_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          push_enabled?: boolean | null
          reminder_before_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          push_enabled?: boolean | null
          reminder_before_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_stats: {
        Row: {
          created_at: string | null
          failed_sent: number | null
          id: string
          last_sent_at: string | null
          successful_sent: number | null
          template_id: string | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          failed_sent?: number | null
          id?: string
          last_sent_at?: string | null
          successful_sent?: number | null
          template_id?: string | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          failed_sent?: number | null
          id?: string
          last_sent_at?: string | null
          successful_sent?: number | null
          template_id?: string | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_stats_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          encrypted_documents: Json | null
          encrypted_personal_data: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          encrypted_documents?: Json | null
          encrypted_personal_data?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          encrypted_documents?: Json | null
          encrypted_personal_data?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recurring_availabilities: {
        Row: {
          consulate_id: string | null
          created_at: string
          day_of_week: number
          end_hour: number
          id: string
          start_hour: number
          updated_at: string
        }
        Insert: {
          consulate_id?: string | null
          created_at?: string
          day_of_week: number
          end_hour: number
          id?: string
          start_hour: number
          updated_at?: string
        }
        Update: {
          consulate_id?: string | null
          created_at?: string
          day_of_week?: number
          end_hour?: number
          id?: string
          start_hour?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_availabilities_consulate_id_fkey"
            columns: ["consulate_id"]
            isOneToOne: false
            referencedRelation: "consulates"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          max_concurrent: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          max_concurrent?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          max_concurrent?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string | null
          device_token: string
          device_type: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_token: string
          device_type: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_token?: string
          device_type?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_appointment_availability:
        | {
            Args: {
              appointment_date: string
              duration_minutes?: number
            }
            Returns: boolean
          }
        | {
            Args: {
              p_appointment_date: string
              p_service_id: string
              p_consulate_id: string
              p_duration_minutes?: number
            }
            Returns: boolean
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
