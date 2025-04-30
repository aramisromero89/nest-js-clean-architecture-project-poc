import { ProfileOutput } from "src/auth/application/dtos/profile.output";
import { ProfileDto } from "../dto/profile.dto";

export function mapProfileToDto(profile: ProfileOutput): ProfileDto {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    surname: profile.surname
  };
}