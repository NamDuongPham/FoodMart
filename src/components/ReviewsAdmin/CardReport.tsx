import { db } from "@/firebase";
import { Card, Progress } from "antd";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaStar, FaUsers } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";

function CardReport() {
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    3: 0,
    4: 0,
    2: 0,
    1: 0,
  });
  const fetchAverageRating = async () => {
    try {
      const commentsRef = ref(db, "comments");
      const commentsSnapshot = await get(commentsRef);

      if (commentsSnapshot.exists()) {
        const comments = Object.values(commentsSnapshot.val());
        const totalRating = comments.reduce(
          (acc, comment) => acc + comment.star,
          0
        );
        const totalComments = comments.length;
        const averageRating = (Number(totalRating) / totalComments).toFixed(1);
        setAverageRating(Number(averageRating));
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };
  const fetchTotalCustomers = async () => {
    try {
      const customersRef = ref(db, "customer");
      const customersSnapshot = await get(customersRef);

      if (customersSnapshot.exists()) {
        const customers = Object.values(customersSnapshot.val());
        setTotalCustomers(customers.length);
      }
    } catch (error) {
      console.error("Error fetching total customers:", error);
    }
  };
  const fetchRatingDistribution = async () => {
    try {
      const commentsRef = ref(db, "comments");
      const commentsSnapshot = await get(commentsRef);

      if (commentsSnapshot.exists()) {
        const comments = Object.values(commentsSnapshot.val());
        const distribution = comments.reduce(
          (acc, comment) => {
            acc[comment.star] = (acc[comment.star] || 0) + 1;
            // console.log(acc);
            return acc;
          },
          { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        );
        const totalComments = comments.length;
        const normalizedDistribution = Object.fromEntries(
          Object.entries(distribution).map(([rating, count]) => [
            rating,
            ((count / totalComments) * 100).toFixed(2),
          ])
        );

        setRatingDistribution(normalizedDistribution);
      }
    } catch (error) {
      console.error("Error fetching rating distribution:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      fetchAverageRating();
      fetchTotalCustomers();
      fetchRatingDistribution();
    }, 2000);
  }, []);

  return (
    <div className="mx-3">
      <div className="flex justify-between">
        {/* REVIEW SCORE */}
        <Card style={{ width: 300 }} loading={loading}>
          <p className="flex justify-center gap-3 ">
            {Array.from({ length: Math.floor(averageRating) }, (_, i) => (
              <FaStar
                key={i}
                color="#f8d518"
                className="text-center w-[20px] h-[30px]"
              />
            ))}
            {averageRating % 1 !== 0 && (
              <FaStar
                color="#f8d518"
                className="text-center w-[20px] h-[30px]"
              />
            )}
          </p>
          <p className="text-center text-[38px] text-[#00193b]">
            {averageRating}
          </p>
          <p className="text-center text-[30px] text-[#00193b]">Review score</p>
        </Card>
        {/* TOTAL CUSTOMER */}
        <Card style={{ width: 300 }} loading={loading}>
          <p className="flex justify-center gap-3  ">
            <FaUsers
              color="white"
              className="bg-[#00ba9d] p-2 rounded-lg text-center w-[35px] h-[35px]"
            />
          </p>
          <p className="text-center text-[38px] text-[#00193b]">
            {totalCustomers}
          </p>
          <p className="text-center text-[30px] text-[#00193b]">
            Total Customer
          </p>
        </Card>
        {/* NEW CUSTOMER */}
        <Card style={{ width: 300 }} loading={loading}>
          <p className="flex justify-center items-center ">
            <HiOutlineUserAdd
              color="white"
              className="bg-[#035ecf] p-2 rounded-lg w-[35px] h-[35px]"
            />
          </p>
          <p className="text-center text-[38px] text-[#00193b]">25+</p>
          <p className="text-center text-[30px] text-[#00193b]">New Customer</p>
        </Card>
        {/* TOTAL Rate */}
        <Card style={{ width: 600 }} loading={loading}>
          {Object.entries(ratingDistribution).map(([rating, percent]) => (
            <div key={rating} className="flex gap-5 items-center">
              <p className="flex items-center gap-1 text-xl">
                {rating}
                <FaStar
                  color="#f8d518"
                  className="text-center w-[20px] h-[20px]"
                />
              </p>
              <Progress
                strokeColor="#f8d518"
                percent={parseFloat(percent)}
                size="default"
              />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default CardReport;
