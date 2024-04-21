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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      APIKey: {
        Row: {
          authorId: string;
          createdAt: string;
          disabledAt: string | null;
          id: string;
          key: string;
          name: string;
          note: string | null;
          projectId: string;
          status: Database["public"]["Enums"]["KeyStatus"];
          updatedAt: string;
        };
        Insert: {
          authorId: string;
          createdAt?: string;
          disabledAt?: string | null;
          id: string;
          key: string;
          name: string;
          note?: string | null;
          projectId: string;
          status: Database["public"]["Enums"]["KeyStatus"];
          updatedAt?: string;
        };
        Update: {
          authorId?: string;
          createdAt?: string;
          disabledAt?: string | null;
          id?: string;
          key?: string;
          name?: string;
          note?: string | null;
          projectId?: string;
          status?: Database["public"]["Enums"]["KeyStatus"];
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "APIKey_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "APIKey_projectId_fkey";
            columns: ["projectId"];
            isOneToOne: false;
            referencedRelation: "Project";
            referencedColumns: ["id"];
          },
        ];
      };
      Meta: {
        Row: {
          createdAt: string;
          id: string;
          key: string;
          postId: string;
          type: Database["public"]["Enums"]["MetaType"];
          updatedAt: string;
          value: string | null;
        };
        Insert: {
          createdAt?: string;
          id: string;
          key: string;
          postId: string;
          type?: Database["public"]["Enums"]["MetaType"];
          updatedAt?: string;
          value?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          key?: string;
          postId?: string;
          type?: Database["public"]["Enums"]["MetaType"];
          updatedAt?: string;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Meta_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
        ];
      };
      Post: {
        Row: {
          authorId: string;
          banner: string | null;
          content: string;
          createdAt: string;
          excerpt: string;
          id: string;
          lang: Database["public"]["Enums"]["Lang"];
          projectId: string;
          slug: string;
          status: Database["public"]["Enums"]["PostStatus"];
          title: string;
          updatedAt: string;
        };
        Insert: {
          authorId: string;
          banner?: string | null;
          content: string;
          createdAt?: string;
          excerpt?: string;
          id: string;
          lang?: Database["public"]["Enums"]["Lang"];
          projectId: string;
          slug: string;
          status: Database["public"]["Enums"]["PostStatus"];
          title: string;
          updatedAt?: string;
        };
        Update: {
          authorId?: string;
          banner?: string | null;
          content?: string;
          createdAt?: string;
          excerpt?: string;
          id?: string;
          lang?: Database["public"]["Enums"]["Lang"];
          projectId?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["PostStatus"];
          title?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Post_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Post_projectId_fkey";
            columns: ["projectId"];
            isOneToOne: false;
            referencedRelation: "Project";
            referencedColumns: ["id"];
          },
        ];
      };
      PostVariant: {
        Row: {
          content: string;
          createdAt: string;
          excerpt: string;
          id: string;
          lang: Database["public"]["Enums"]["Lang"];
          postId: string;
          title: string;
          updatedAt: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          excerpt: string;
          id: string;
          lang?: Database["public"]["Enums"]["Lang"];
          postId: string;
          title: string;
          updatedAt?: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          excerpt?: string;
          id?: string;
          lang?: Database["public"]["Enums"]["Lang"];
          postId?: string;
          title?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PostVariant_postId_fkey";
            columns: ["postId"];
            isOneToOne: false;
            referencedRelation: "Post";
            referencedColumns: ["id"];
          },
        ];
      };
      Project: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          name: string;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Project_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          createdAt: string;
          email: string;
          firstName: string | null;
          id: string;
          lastName: string | null;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          email: string;
          firstName?: string | null;
          id: string;
          lastName?: string | null;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          email?: string;
          firstName?: string | null;
          id?: string;
          lastName?: string | null;
          updatedAt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      KeyStatus: "ACTIVE" | "INACTIVE";
      Lang:
        | "AB"
        | "AA"
        | "AF"
        | "AK"
        | "SQ"
        | "AM"
        | "AR"
        | "AN"
        | "HY"
        | "AS"
        | "AV"
        | "AE"
        | "AY"
        | "AZ"
        | "BM"
        | "BA"
        | "EU"
        | "BE"
        | "BN"
        | "BH"
        | "BI"
        | "BS"
        | "BR"
        | "BG"
        | "MY"
        | "CA"
        | "KM"
        | "CH"
        | "CE"
        | "NY"
        | "ZH"
        | "CU"
        | "CV"
        | "KW"
        | "CO"
        | "CR"
        | "HR"
        | "CS"
        | "DA"
        | "DV"
        | "NL"
        | "DZ"
        | "EN"
        | "EO"
        | "ET"
        | "EE"
        | "FO"
        | "FJ"
        | "FI"
        | "FR"
        | "FF"
        | "GD"
        | "GL"
        | "LG"
        | "KA"
        | "DE"
        | "KI"
        | "EL"
        | "KL"
        | "GN"
        | "GU"
        | "HT"
        | "HA"
        | "HE"
        | "HZ"
        | "HI"
        | "HO"
        | "HU"
        | "IS"
        | "IO"
        | "IG"
        | "ID"
        | "IA"
        | "IE"
        | "IU"
        | "IK"
        | "GA"
        | "IT"
        | "JA"
        | "JV"
        | "KN"
        | "KR"
        | "KS"
        | "KK"
        | "RW"
        | "KV"
        | "KG"
        | "KO"
        | "KJ"
        | "KU"
        | "KY"
        | "LO"
        | "LA"
        | "LV"
        | "LB"
        | "LI"
        | "LN"
        | "LT"
        | "LU"
        | "MK"
        | "MG"
        | "MS"
        | "ML"
        | "MT"
        | "GV"
        | "MI"
        | "MR"
        | "MH"
        | "RO"
        | "MN"
        | "NA"
        | "NV"
        | "ND"
        | "NG"
        | "NE"
        | "SE"
        | "NO"
        | "NB"
        | "NN"
        | "II"
        | "OC"
        | "OJ"
        | "OR"
        | "OM"
        | "OS"
        | "PI"
        | "PA"
        | "PS"
        | "FA"
        | "PL"
        | "PT"
        | "QU"
        | "RM"
        | "RN"
        | "RU"
        | "SM"
        | "SG"
        | "SA"
        | "SC"
        | "SR"
        | "SN"
        | "SD"
        | "SI"
        | "SK"
        | "SL"
        | "SO"
        | "ST"
        | "NR"
        | "ES"
        | "SU"
        | "SW"
        | "SS"
        | "SV"
        | "TL"
        | "TY"
        | "TG"
        | "TA"
        | "TT"
        | "TE"
        | "TH"
        | "BO"
        | "TI"
        | "TO"
        | "TS"
        | "TN"
        | "TR"
        | "TK"
        | "TW"
        | "UG"
        | "UK"
        | "UR"
        | "UZ"
        | "VE"
        | "VI"
        | "VO"
        | "WA"
        | "CY"
        | "FY"
        | "WO"
        | "XH"
        | "YI"
        | "YO"
        | "ZA"
        | "ZU";
      MetaType: "STRING" | "NUMBER" | "BOOLEAN";
      PostStatus: "DRAFT" | "PUBLISHED";
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
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
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
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
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
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