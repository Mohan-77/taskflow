import { Schema, model, models } from "mongoose";

export const PROFILE_PHOTO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
] as const;

export type ProfilePhotoType = (typeof PROFILE_PHOTO_TYPES)[number];

export interface IProfilePhoto {
  userId: string;
  contentType: ProfilePhotoType;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const profilePhotoSchema = new Schema<IProfilePhoto>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: PROFILE_PHOTO_TYPES,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProfilePhoto =
  models.ProfilePhoto || model<IProfilePhoto>("ProfilePhoto", profilePhotoSchema);

export default ProfilePhoto;
