// Auto-generated types dari Supabase. Bisa di-regenerate dengan:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export type ProjectCategory =
  | "video_editing"
  | "graphic_design"
  | "3d_vfx"
  | "physics"
  | "programming"
  | "photography";

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: ProjectCategory;
          tags: string[];
          thumbnail_url: string | null;
          media_urls: string[];
          external_url: string | null;
          gdrive_url: string | null;
          featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: ProjectCategory;
          tags?: string[];
          thumbnail_url?: string | null;
          media_urls?: string[];
          external_url?: string | null;
          gdrive_url?: string | null;
          featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          percentage: number;
          category: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          percentage: number;
          category: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
      };
      about: {
        Row: {
          id: string;
          full_name: string;
          tagline: string;
          bio: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          socials: Record<string, string>;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          tagline: string;
          bio: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          socials?: Record<string, string>;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["about"]["Insert"]>;
      };
      coding_stats_cache: {
        Row: {
          id: string;
          data: Record<string, unknown>;
          fetched_at: string;
        };
        Insert: {
          id?: string;
          data: Record<string, unknown>;
          fetched_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["coding_stats_cache"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      project_category: ProjectCategory;
    };
  };
};

// Helper types yang sering dipakai
export type Project =
  Database["public"]["Tables"]["projects"]["Row"];
export type Skill =
  Database["public"]["Tables"]["skills"]["Row"];
export type About =
  Database["public"]["Tables"]["about"]["Row"];
