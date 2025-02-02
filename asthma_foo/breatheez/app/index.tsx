import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/auth/login" />; // Change this if you want another default page
}
