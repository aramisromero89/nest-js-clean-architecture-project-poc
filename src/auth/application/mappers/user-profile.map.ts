import { User } from "src/auth/domain/entities/user";
import { ProfileOutput } from "../dtos/profile.output";

export function mapUserToProfileOutput(user: User): ProfileOutput {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        profilePicture: user.profilePicture,
    };
}