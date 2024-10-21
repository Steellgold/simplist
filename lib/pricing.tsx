import { Users } from "lucide-react";
import { ReactElement } from "react";

export enum FeatureId {
  TeamSize,
}

enum PlanId {
  Free,
  Pro,
  Business,
}

export const FeatureLimits: Record<FeatureId, Record<PlanId, number | boolean>> = {
  [FeatureId.TeamSize]: {
    [PlanId.Free]: 1,
    [PlanId.Pro]: 5,
    [PlanId.Business]: 20,
  },
};

export type FeatureInfo = {
  icon: ReactElement;
  featureName: string;
  featureDescription: string;
}

export const features: Record<FeatureId, FeatureInfo> = {
  [FeatureId.TeamSize]: {
    icon: <Users size={24} />,
    featureName: "Team size",
    featureDescription: "The number of team members you can invite.",
  }
};

export type Feature = {
  id: FeatureId;
  display: string;
  available?: boolean;
}

export type Plan = {
  display: string;
  price: number;
  features: Feature[];
}

export const plans: Plan[] = [
  {
    display: "Pro",
    price: 5.99,
    features: [
      { id: FeatureId.TeamSize, display: "5 team members", available: true },
    ],
  },
  {
    display: "Business",
    price: 9.99,
    features: [
      { id: FeatureId.TeamSize, display: "20 team members", available: true },
    ]
  }
];