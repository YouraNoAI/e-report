import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCases,
  getCaseByStudent,
  updateCaseStatus,
} from "../services/caseService";

export function useCases() {
  return useQuery({
    queryKey: ["cases"],
    queryFn: getCases,
  });
}

export function useCaseByStudent(studentId) {
  return useQuery({
    queryKey: ["cases", "student", studentId],
    queryFn: () => getCaseByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useUpdateCaseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ progressId, status, userId, notes }) =>
      updateCaseStatus(progressId, status, userId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}
