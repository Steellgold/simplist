import { Blocks, Languages, Users } from "lucide-react";
import type { ReactElement } from "react";

export enum FeatureId {
  TeamSize,
  VariantsPerPost,
  Integrations
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
    [PlanId.Business]: 20
  },
  [FeatureId.VariantsPerPost]: {
    [PlanId.Free]: 1,
    [PlanId.Pro]: 3,
    [PlanId.Business]: -1
  },
  [FeatureId.Integrations]: {
    [PlanId.Free]: 1,
    [PlanId.Pro]: 3,
    [PlanId.Business]: -1
  }
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
    featureDescription: "The number of team members you can invite."
  },
  [FeatureId.VariantsPerPost]: {
    icon: <Languages size={24} />,
    featureName: "Variants per post",
    featureDescription: "The number of variants you can create per post."
  },
  [FeatureId.Integrations]: {
    icon: <Blocks size={24} />,
    featureName: "Integrations",
    featureDescription: "The number of integrations you can configure."
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
      { id: FeatureId.VariantsPerPost, display: "3 variants per post", available: true },
      { id: FeatureId.Integrations, display: "3 integrations", available: true }
    ]
  },
  {
    display: "Business",
    price: 9.99,
    features: [
      { id: FeatureId.TeamSize, display: "20 team members", available: true },
      { id: FeatureId.VariantsPerPost, display: "Unlimited variants per post", available: true },
      { id: FeatureId.Integrations, display: "Unlimited integrations", available: true }
    ]
  }
];