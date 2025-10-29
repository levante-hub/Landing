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
    }
  }
}

export type QuestionnaireResponse = Database['public']['Tables']['questionnaire_responses']['Insert']
