import { NowRequest, NowResponse } from "@now/node";

export default (req: NowRequest, res: NowResponse) => {
  res.json({ name: "John Doe", email: "johndoe@example.com" });
};
