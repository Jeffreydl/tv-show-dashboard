export interface CastMember {
  person: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
    [key: string]: unknown;
  };
  character: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
    [key: string]: unknown;
  };
  self: boolean;
  voice: boolean;
}
