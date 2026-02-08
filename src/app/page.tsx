import SpendingTest from "@/components/spending-test";
import { parseRefCode } from "@/lib/utils";

const Home = async ({ searchParams }: { searchParams: Promise<{ ref?: string }> }) => {
  const { ref } = await searchParams;
  const refCode = ref ? parseRefCode(ref) : null;

  return <SpendingTest refCode={refCode} />;
};

export default Home;
