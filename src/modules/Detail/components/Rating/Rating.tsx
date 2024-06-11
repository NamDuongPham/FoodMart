import { auth, db } from "@/firebase";
import { IComment } from "@/types/Comment";
import { Button, Col, Form, Input, Select, notification } from "antd";

import { onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function Rating() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  // const [canComment, setCanComment] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [star, setStar] = useState();
  //product/sanpham1 , key
  const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  useEffect(() => {
    const commentsRef = ref(db, "comments");
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsList = Object.entries(commentsData)
          .map(([key, value]) => ({
            key,
            ...value,
          }))
          .filter((cmt) => cmt.productID === id);

        const distribution = commentsList.reduce(
          (acc, comment) => {
            acc[comment.star] = (acc[comment.star] || 0) + 1;
            return acc;
          },
          { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        );
        setRatingDistribution(distribution);
        setComments(commentsList);
      } else {
        setComments([]);
      }
    });
  }, [id]);
  const totalReviews = comments.length;
  const averageRating =
    totalReviews > 0
      ? comments.reduce((sum, cmt) => sum + parseInt(cmt.star, 10), 0) /
        totalReviews
      : 0;

  const handleAddComment = async () => {
    try {
      // Lấy productID từ URL
      const productID = id;
      const currentUser = auth.currentUser?.uid; // Lấy customerID từ đâu đó
      const createAt = new Date().getTime();
      const newDocRef = await push(ref(db, "comments"));
      await set(newDocRef, {
        title: title,
        comment: comment,
        star: Number(star),
        customerID: currentUser,
        productID: productID,
        createAt: createAt,
      });
      notification.success({
        message: "add comment success!",
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
      notification.error({
        message: "add comment fail!",
      });
    }
  };
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };
  return (
    <div className="container mx-auto mt-10">
      <div>
        <h2 className="text-[25px] text-[#123829] text-center font-semibold">
          Customer Reviews
        </h2>
      </div>
      <div className="flex mt-5">
        {/* 1 */}
        <Col
          xs={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="flex items-center border-solid border-r-[1px] border-[#1238291a]"
        >
          <div className="flex flex-col gap-2 text-[#123829] text-[16px] ">
            <div className="flex gap-2">
              <BsFillStarFill color="#123829" /> <p>{averageRating.toFixed(1)} out of 5</p>
            </div>
            <div>Based on {totalReviews} review</div>
            {/* đổi số 1 review thành cout tổng review */}
          </div>
        </Col>
        {/* 2 */}
        <Col
          xs={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="border-solid border-r-[1px] border-[#1238291a]"
        >
          <div className="flex flex-col gap-2">
            {Object.entries(ratingDistribution).map(([rating, count]) => (
              <div key={rating} className="flex justify-between max-w-[250px]">
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <BsFillStarFill
                      key={index}
                      color={
                        index < parseInt(rating, 10) ? "#123829" : "#d9d9d9"
                      }
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[#123829]">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </Col>
        {/* 3 */}
        <Col
          xs={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="flex items-center"
        >
          <button
            className="bg-[#123829] py-2 px-5 text-[20px] font-bold text-white"
            onClick={toggleReviewForm}
          >
            {showReviewForm ? "Cancel" : "Write a review"}
          </button>
        </Col>
      </div>
      {/* form */}
      {showReviewForm && (
        <div className="my-5 relative left-[30%] ease-in duration-300 overflow-hidden">
          <FormCustom
            variant="filled"
            style={{ maxWidth: 600 }}
            className="text-[#123829]"
          >
            <Form.Item
              label="Review Title"
              name="Title"
              rules={[
                { required: true, message: "Please input title comment!" },
              ]}
            >
              <Input
                placeholder="Give your review a title"
                className="text-[#123829]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="Comment"
              rules={[{ required: true, message: "Please input comment!" }]}
            >
              <Input.TextArea
                placeholder="Write your comments here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Rating (star)"
              name="Rating"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select
                placeholder="Rating products here"
                value={star}
                onChange={(value) => setStar(value)}
              >
                <Select.Option value="1">
                  <p className="flex items-center gap-2">
                    {" "}
                    <BsFillStarFill color="#123829" />
                  </p>{" "}
                </Select.Option>
                <Select.Option value="2">
                  <p className="flex items-center gap-2">
                    {" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />
                  </p>{" "}
                </Select.Option>
                <Select.Option value="3">
                  <p className="flex items-center gap-2">
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />
                  </p>{" "}
                </Select.Option>
                <Select.Option value="4">
                  <p className="flex items-center gap-2">
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />
                  </p>
                </Select.Option>
                <Select.Option value="5">
                  <p className="flex items-center gap-2">
                    {" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />{" "}
                    <BsFillStarFill color="#123829" />
                  </p>{" "}
                </Select.Option>
              </Select>
            </Form.Item>

            <div className="flex gap-5">
              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                  type="default"
                  htmlType="submit"
                  onClick={toggleReviewForm}
                >
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    handleAddComment();
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </FormCustom>
        </div>
      )}
    </div>
  );
}

export default Rating;
const FormCustom = styled(Form)`
  border: 1px solid #c4c4c4;
  padding: 20px;
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-item
    .ant-form-item-label
    > label {
    color: #123829;
    font-weight: 600;
    font-size: 18px;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-row {
    display: block;
    flex-flow: row wrap;
    min-width: 0;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-item
    .ant-form-item-label {
    flex-grow: 0;
    overflow: hidden;
    white-space: nowrap;
    text-align: start;
    vertical-align: middle;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-btn-primary {
    color: #fff;
    background: #123829;
    box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-btn-primary:not(
      :disabled
    ):not(.ant-btn-disabled):hover {
    color: #fff;
    background: #123829;
  }
  button:hover {
    border-color: #fff;
  }
`;
