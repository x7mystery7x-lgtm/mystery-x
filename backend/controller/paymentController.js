import Payment from "../models/Payment.js";
import User from "../models/User.js";

const MONTHLY_FEE = 5000;

export async function makePyment(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { monthPaidFor, amountPaid } = req.body;
    if (!monthPaidFor || !amountPaid)
      return res.status(400).json({
        error: "Missing payment fields",
      });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const outstandingBefore = user.outstanding;

    const requiredAmount = MONTHLY_FEE + outstandingBefore;

    let outstandingAfter = requiredAmount - amountPaid;
    if (outstandingAfter < 0) outstandingAfter = 0;

    const payment = await Payment.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      account: user.account,
      street: user.street,

      monthPaidFor,
      requiredAmount,
      amountPaid,
      outstandingBefore,
      outstandingAfter,
    });

    user.outstanding = outstandingAfter;
    await user.save();

    res.json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}

export const userPayHisyory = async (req, res) => {
  try {
    const payment = await Payment.find({ userId: req.session.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ payment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const allPaymentHistory = async (req, res) => {
  try {
    const payment = await Payment.find()
      .populate("userId", "name email account")
      .sort({ createdAt: -1 });
    return res.json({ payment });
  } catch (error) {}
};
