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
      exam_attempts: {
        Row: {
          id: string
          test_id: string
          user_id: string
          status: 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'TIMED_OUT'
          started_at: string
          submitted_at: string | null
          remaining_seconds: number
          current_question_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_id: string
          user_id: string
          status?: 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'TIMED_OUT'
          started_at?: string
          submitted_at?: string | null
          remaining_seconds: number
          current_question_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          user_id?: string
          status?: 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'TIMED_OUT'
          started_at?: string
          submitted_at?: string | null
          remaining_seconds?: number
          current_question_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      exam_attempt_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          answer: Json
          flagged: boolean
          visited: boolean
          answered_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          answer?: Json
          flagged?: boolean
          visited?: boolean
          answered_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          answer?: Json
          flagged?: boolean
          visited?: boolean
          answered_at?: string | null
          updated_at?: string
        }
      }
      exam_highlights: {
        Row: {
          id: string
          attempt_id: string
          section_id: string
          start_offset: number
          end_offset: number
          selected_text: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          section_id: string
          start_offset: number
          end_offset: number
          selected_text: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          section_id?: string
          start_offset?: number
          end_offset?: number
          selected_text?: string
          color?: string
          created_at?: string
        }
      }
      exam_modules: {
        Row: {
          id: string
          code: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING'
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          code: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING'
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING'
          name?: string
          created_at?: string
        }
      }
      exam_questions: {
        Row: {
          id: string
          test_id: string
          section_id: string
          group_id: string
          question_number: number
          question_type: string
          prompt: string
          config: Json
          answer_key: Json
          mapping: Json
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          section_id: string
          group_id: string
          question_number: number
          question_type: string
          prompt: string
          config?: Json
          answer_key?: Json
          mapping?: Json
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          section_id?: string
          group_id?: string
          question_number?: number
          question_type?: string
          prompt?: string
          config?: Json
          answer_key?: Json
          mapping?: Json
          created_at?: string
        }
      }
      exam_question_groups: {
        Row: {
          id: string
          test_id: string
          section_id: string
          group_order: number
          title: string
          instructions: string
          shared_config: Json
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          section_id: string
          group_order: number
          title: string
          instructions: string
          shared_config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          section_id?: string
          group_order?: number
          title?: string
          instructions?: string
          shared_config?: Json
          created_at?: string
        }
      }
      exam_sections: {
        Row: {
          id: string
          test_id: string
          section_order: number
          title: string
          content_html: string
          content_markdown: string | null
          mapping: Json
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          section_order: number
          title: string
          content_html: string
          content_markdown?: string | null
          mapping?: Json
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          section_order?: number
          title?: string
          content_html?: string
          content_markdown?: string | null
          mapping?: Json
          metadata?: Json
          created_at?: string
        }
      }
      exam_submissions: {
        Row: {
          id: string
          attempt_id: string
          raw_score: number
          band_score: number | null
          breakdown: Json
          submitted_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          raw_score?: number
          band_score?: number | null
          breakdown?: Json
          submitted_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          raw_score?: number
          band_score?: number | null
          breakdown?: Json
          submitted_at?: string
        }
      }
      exam_tests: {
        Row: {
          id: string
          module_id: string
          slug: string
          title: string
          version: number
          total_questions: number
          duration_seconds: number
          status: string
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          slug: string
          title: string
          version?: number
          total_questions: number
          duration_seconds: number
          status?: string
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          slug?: string
          title?: string
          version?: number
          total_questions?: number
          duration_seconds?: number
          status?: string
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'moderator' | 'admin'
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'user' | 'moderator' | 'admin'
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'moderator' | 'admin'
          assigned_by?: string | null
          assigned_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role: 'user' | 'moderator' | 'admin'
          permission: 'exams.create' | 'exams.edit' | 'exams.delete' | 'exams.publish' | 'users.manage' | 'leaderboard.view' | 'results.view_all'
          created_at: string
        }
        Insert: {
          id?: string
          role: 'user' | 'moderator' | 'admin'
          permission: 'exams.create' | 'exams.edit' | 'exams.delete' | 'exams.publish' | 'users.manage' | 'leaderboard.view' | 'results.view_all'
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'moderator' | 'admin'
          permission?: 'exams.create' | 'exams.edit' | 'exams.delete' | 'exams.publish' | 'users.manage' | 'leaderboard.view' | 'results.view_all'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_user_roles_and_permissions: {
        Args: {
          target_user_id: string
        }
        Returns: Json
      }
      user_has_permission: {
        Args: {
          permission_name: string
        }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          role_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_permission: 'exams.create' | 'exams.edit' | 'exams.delete' | 'exams.publish' | 'users.manage' | 'leaderboard.view' | 'results.view_all'
      app_role: 'user' | 'moderator' | 'admin'
      attempt_status: 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'TIMED_OUT'
      exam_module_type: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never