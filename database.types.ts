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
      allowed_domains: {
        Row: {
          city: string | null
          created_at: string
          domain: string
          id: number
          school: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          domain: string
          id?: number
          school?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          domain?: string
          id?: number
          school?: string | null
        }
        Relationships: []
      }
      allowed_emails: {
        Row: {
          city: string
          created_at: string
          email: string
          id: number
          school: string
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          id?: number
          school: string
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          id?: number
          school?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          comments: number
          content: string
          created_at: string
          id: number
          likes: number
          post: number
          user: string
          user_tag: string
          username: string | null
          views: number
        }
        Insert: {
          comments?: number
          content: string
          created_at?: string
          id?: number
          likes?: number
          post: number
          user: string
          user_tag: string
          username?: string | null
          views?: number
        }
        Update: {
          comments?: number
          content?: string
          created_at?: string
          id?: number
          likes?: number
          post?: number
          user?: string
          user_tag?: string
          username?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_comments_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_comments_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: number
          post: number | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post?: number | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_likes_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_likes_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          city: string
          comments: number
          content: string
          created_at: string
          feed: string | null
          id: number
          likes: number
          school: string
          threads: number
          user: string
          user_tag: string
          username: string
          views: number
        }
        Insert: {
          city: string
          comments?: number
          content: string
          created_at?: string
          feed?: string | null
          id?: number
          likes?: number
          school: string
          threads?: number
          user?: string
          user_tag: string
          username: string
          views?: number
        }
        Update: {
          city?: string
          comments?: number
          content?: string
          created_at?: string
          feed?: string | null
          id?: number
          likes?: number
          school?: string
          threads?: number
          user?: string
          user_tag?: string
          username?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_posts_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      thread_likes: {
        Row: {
          created_at: string
          id: number
          thread: number | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          thread?: number | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          thread?: number | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_thread_likes_thread_fkey"
            columns: ["thread"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_thread_likes_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      threads: {
        Row: {
          comments: number
          content: string
          created_at: string
          feed: string
          id: number
          likes: number
          parent1: number | null
          parent2: number | null
          user: string
          user_tag: string
          username: string
          views: number
        }
        Insert: {
          comments?: number
          content: string
          created_at?: string
          feed: string
          id?: number
          likes?: number
          parent1?: number | null
          parent2?: number | null
          user: string
          user_tag: string
          username: string
          views?: number
        }
        Update: {
          comments?: number
          content?: string
          created_at?: string
          feed?: string
          id?: number
          likes?: number
          parent1?: number | null
          parent2?: number | null
          user?: string
          user_tag?: string
          username?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_threads_parent1_fkey"
            columns: ["parent1"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_threads_parent2_fkey"
            columns: ["parent2"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_threads_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          city: string | null
          created_at: string
          id: string
          school: string | null
          username: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          school?: string | null
          username: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          school?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
