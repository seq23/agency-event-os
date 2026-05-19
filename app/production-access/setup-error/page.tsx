export const dynamic = "force-dynamic";

import { BrandedSetupError } from "@/components/system/BrandedSetupError";
import { accessDefaultLines, missingAccessEnv } from "@/lib/env/safeEnv";
export default function ProductionSetupErrorPage() {
  return <BrandedSetupError title="Production access is not configured yet." message="A front-door route detected missing access configuration. Set the variables below before relying on crew or special guest access." missingVariables={missingAccessEnv()} defaultValues={accessDefaultLines()} />;
}
