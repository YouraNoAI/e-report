import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getViolations,
  getViolation,
  getViolationsByStudent,
  createViolation,
  deleteViolation,
} from "../services/violationService";

export function useViolations() {
  return useQuery({
    queryKey: ["violations"],
    queryFn: getViolations,
  });
}

export function useViolation(id) {
  return useQuery({
    queryKey: ["violations", id],
    queryFn: () => getViolation(id),
    enabled: !!id,
  });
}

export function useViolationsByStudent(studentId) {
  return useQuery({
    queryKey: ["violations", "student", studentId],
    queryFn: () => getViolationsByStudent(studentId),
    enabled: !!studentId,
  });
}

export function useCreateViolation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createViolation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

export function useDeleteViolation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteViolation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}
