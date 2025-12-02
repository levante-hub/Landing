export type Database = {
  public: {
    Tables: {
      questionnaire_responses: {
        Row: {
          id: string
          name: string
          linkedin: string | null
          intention: string
          role: string | null
          role_other: string | null
          experience: string | null
          time_commitment: string | null
          completed_path: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          linkedin?: string | null
          intention: string
          role?: string | null
          role_other?: string | null
          experience?: string | null
          time_commitment?: string | null
          completed_path: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          linkedin?: string | null
          intention?: string
          role?: string | null
          role_other?: string | null
          experience?: string | null
          time_commitment?: string | null
          completed_path?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          content: string
          author_display_name: string | null
          author_client_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          author_display_name?: string | null
          author_client_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          author_display_name?: string | null
          author_client_id?: string
        }
      }
      feedback_likes: {
        Row: {
          feedback_id: string
          voter_client_id: string
          created_at: string
        }
        Insert: {
          feedback_id: string
          voter_client_id: string
          created_at?: string
        }
        Update: {
          feedback_id?: string
          voter_client_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type QuestionnaireResponse = Database['public']['Tables']['questionnaire_responses']['Insert']
