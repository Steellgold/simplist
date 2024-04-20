-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('AB', 'AA', 'AF', 'AK', 'SQ', 'AM', 'AR', 'AN', 'HY', 'AS', 'AV', 'AE', 'AY', 'AZ', 'BM', 'BA', 'EU', 'BE', 'BN', 'BH', 'BI', 'BS', 'BR', 'BG', 'MY', 'CA', 'KM', 'CH', 'CE', 'NY', 'ZH', 'CU', 'CV', 'KW', 'CO', 'CR', 'HR', 'CS', 'DA', 'DV', 'NL', 'DZ', 'EN', 'EO', 'ET', 'EE', 'FO', 'FJ', 'FI', 'FR', 'FF', 'GD', 'GL', 'LG', 'KA', 'DE', 'KI', 'EL', 'KL', 'GN', 'GU', 'HT', 'HA', 'HE', 'HZ', 'HI', 'HO', 'HU', 'IS', 'IO', 'IG', 'ID', 'IA', 'IE', 'IU', 'IK', 'GA', 'IT', 'JA', 'JV', 'KN', 'KR', 'KS', 'KK', 'RW', 'KV', 'KG', 'KO', 'KJ', 'KU', 'KY', 'LO', 'LA', 'LV', 'LB', 'LI', 'LN', 'LT', 'LU', 'MK', 'MG', 'MS', 'ML', 'MT', 'GV', 'MI', 'MR', 'MH', 'RO', 'MN', 'NA', 'NV', 'ND', 'NG', 'NE', 'SE', 'NO', 'NB', 'NN', 'II', 'OC', 'OJ', 'OR', 'OM', 'OS', 'PI', 'PA', 'PS', 'FA', 'PL', 'PT', 'QU', 'RM', 'RN', 'RU', 'SM', 'SG', 'SA', 'SC', 'SR', 'SN', 'SD', 'SI', 'SK', 'SL', 'SO', 'ST', 'NR', 'ES', 'SU', 'SW', 'SS', 'SV', 'TL', 'TY', 'TG', 'TA', 'TT', 'TE', 'TH', 'BO', 'TI', 'TO', 'TS', 'TN', 'TR', 'TK', 'TW', 'UG', 'UK', 'UR', 'UZ', 'VE', 'VI', 'VO', 'WA', 'CY', 'FY', 'WO', 'XH', 'YI', 'YO', 'ZA', 'ZU');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "lang" "Lang" NOT NULL DEFAULT 'EN';

-- CreateTable
CREATE TABLE "PostVariant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "lang" "Lang" NOT NULL DEFAULT 'FR',
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostVariant" ADD CONSTRAINT "PostVariant_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
