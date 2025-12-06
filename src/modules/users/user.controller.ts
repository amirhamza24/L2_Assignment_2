import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  console.log(req.user);

  // if (!req.user) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "Unauthorized!",
  //   });
  // }
  try {
    const { name, email, phone, role } = req.body;
    const loggedInUser = req.user;
    const id = req.params.id;

    // if (loggedInUser.role !== "admin" && loggedInUser.id.toString() !== id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized!",
    //   });
    // }

    // let newRole = undefined;
    // if (loggedInUser.role === "admin") {
    //   newRole = role;
    // }

    const result = await userServices.updateUser(
      name,
      email,
      role,
      phone,
      id as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const user = result.rows[0];

    if (user.password) {
      delete user.password;
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const userControllers = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
