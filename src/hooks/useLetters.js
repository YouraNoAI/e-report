import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLetters,
  getLetter,
  createLetter,
  updateLetterStatus,
} from "../services/letterService";

export function useLetters() {
  return useQuery({
    queryKey: ["letters"],
    queryFn: getLetters,
  });
}

export function useLetter(id) {
  return useQuery({
    queryKey: ["letters", id],
    queryFn: () => getLetter(id),
    enabled: !!id,
  });
}

export function useCreateLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLetter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}

export function useUpdateLetterStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateLetterStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}
