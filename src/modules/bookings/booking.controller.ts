import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user!;
    const userId = loggedInUser.id;
    const role = loggedInUser.role;
    console.log("Logged in user ID:", userId);
    console.log("Role:", role);

    // const result = await bookingServices.getAllBookings();

    let result;

    if (role === "admin") {
      result = await bookingServices.getAllBookings();
    } else {
      result = await bookingServices.getAllBookingsByCustomer(userId);
    }

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
};
