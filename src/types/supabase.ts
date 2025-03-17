export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
        };
        Update: {
          title?: string;
          updated_at?: string;
          status?: string;
        };
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          content: string;
          type: 'user' | 'ai';
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          content: string;
          type: 'user' | 'ai';
          created_at?: string;
          status?: string;
        };
        Update: {
          content?: string;
          status?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          diagnosis: string;
          room_number: string;
          status: string;
          created_at: string;
          updated_at: string;
          admission_date: string;
          echo_data: Record<string, any>;
          ecg_data: Record<string, any>;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          diagnosis: string;
          room_number: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          admission_date?: string;
          echo_data?: Record<string, any>;
          ecg_data?: Record<string, any>;
        };
        Update: {
          name?: string;
          diagnosis?: string;
          room_number?: string;
          status?: string;
          updated_at?: string;
          admission_date?: string;
          echo_data?: Record<string, any>;
          ecg_data?: Record<string, any>;
        };
      };
      patient_notes: {
        Row: {
          id: string;
          patient_id: string;
          content: string;
          type: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          content: string;
          type?: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          content?: string;
          type?: string;
        };
      };
    };
    Functions: {
      lookup_user_by_email: {
        Args: { lookup_email: string };
        Returns: { id: string; email: string }[];
      };
      create_conversation_with_participant: {
        Args: { user_id: string };
        Returns: string;
      };
      delete_conversation: {
        Args: { conversation_id: string };
        Returns: void;
      };
      copy_patient_data: {
        Args: { share_request_id: string };
        Returns: void;
      };
    };
  };
};