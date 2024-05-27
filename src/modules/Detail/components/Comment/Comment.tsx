import { db } from "@/firebase";
import { IComment } from "@/types/Comment";
import { IUser } from "@/types/user";
import { format } from "date-fns";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { useParams } from "react-router-dom";

function Comment() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [customer, setCustomer] = useState<IUser | null>(null);
  const { id } = useParams();
  useEffect(() => {
    const commentsRef = ref(db, "comments");
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsList = Object.entries(commentsData).map(
          ([key, value]) => ({
            key,
            ...value,
          })
        );
        const comment = commentsList.filter((cmt) => cmt.productID === id);
        setComments(comment);
        const customerRef = ref(db, `customer/${comment?.customerID}`);
        onValue(customerRef, (customerSnapshot) => {
          const customerData = customerSnapshot.val();
          setCustomer(customerData);
        });
      } else {
        setComments([]);
      }
    });
  }, []);
  // console.log(customer);

  return (
    <div className="container mx-auto border-solid border-[1px] border-[#cfcfcf] p-3 mt-5">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="my-5">
            <div className="border-solid border-t-[1px] border-b-[1px] border-[#cfcfcf] py-2 flex justify-between">
              <div className="flex gap-2">
                {Array.from({ length: parseInt(comment?.star || "0") }).map(
                  (_, index) => (
                    <BsFillStarFill key={index} color="#123829" />
                  )
                )}
              </div>
              <div className="text-[#E85353] font-semibold">
                {format(comment?.createAt || 0, "MM/dd/yyyy")}
              </div>
            </div>
            {/*  */}
            <div className="flex flex-col mt-3">
              <div className="flex gap-3 items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                  alt="image user"
                  className="w-[40px]"
                />
                <p>{customer?.emailCustomer}</p>
              </div>
              {/* title */}
              <div className="mt-2">
                <p className="font-medium text-[#123829]">{comment?.title}</p>
              </div>
              {/* comment */}
              <div className="mt-2">
                <p className=" text-[#123829]">{comment?.comment}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-red-500 font-medium text-xl">
          Don't have any comment
        </div>
      )}
    </div>
  );
}

export default Comment;
