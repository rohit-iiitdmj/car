import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { deleteCourse, fetchInstructorCourses } from "../../../services/AuthL";
import ConfirmationModal from "../../common/ConfirmationModal";

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 50;

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    console.log(courseId)
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">Cars</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Condition</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Price</Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Car list found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr key={course._id} className="flex gap-x-10 border-b border-richblack-800 px-6 py-8">
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.images[0]}
                    alt={course?.title}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">{course.title}</p>
                    <p className="text-xs text-richblack-300">
                      {course.description?.split(" ").length > TRUNCATE_LENGTH
                        ? course.description.split(" ").slice(0, TRUNCATE_LENGTH).join(" ") + "..."
                        : course.description || "No description available."}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  {course.condition || "New"}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">₹{course.price || 500000}</Td>
                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you want to delete this car?",
                        text2: "All the data related to this Car will be deleted",
                        btn1Text: loading ? "Loading..." : "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: loading ? null : () => handleCourseDelete(course._id),
                        btn2Handler: loading ? null : () => setConfirmationModal(null),
                      })
                    }
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
