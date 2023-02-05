import { useState } from "react";
import { api } from "../utils/api";

const Test = () => {
  const [image, setImage] = useState<File>();
  const attendanceMutation = api.employee.attendance.useMutation();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!image) return;

          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = async () => {
            await attendanceMutation.mutateAsync({
              id: "1",
              type: "TIME_IN",
              imageBase64: reader.result as string,
            });
          };
        }}
      >
        <label htmlFor="time-in-image">Time In Image</label>
        <input
          type="file"
          name=""
          id="time-in-image"
          required
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        <button
          type="submit"
          className="button"
          disabled={attendanceMutation.isLoading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Test;
