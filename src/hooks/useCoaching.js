import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoachingNotes,
  getCoachingByStudent,
  createCoachingNote,
} from "../services/coachingService";

export function useCoachingNotes() {
  return useQuery({
    queryKey: ["coaching"],
    queryFn: getCoachingNotes,
  });
}

export function useCoachingByStudent(studentId) {
  return useQuery({
    queryKey: ["coaching", "student", studentId],
    queryFn: () => getCoachingByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useCreateCoachingNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, type }) => createCoachingNote(data, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching"] });
    },
  });
}
