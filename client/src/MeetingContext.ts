import { Meeting } from "@types";
import { createContext } from "react";

export const MeetingContext = createContext<Meeting>({} as Meeting);
