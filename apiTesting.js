import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    load_test: {
      executor: "constant-arrival-rate",
      rate: 5000,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 100,
      maxVUs: 1000,
    },
  },
};

export default function() {
  http.get('http://localhost:3002/api/v1/movies/get-all-movies');
//   sleep(1);
}