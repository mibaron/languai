import { useExercisesAvailableTypesRetrieve } from "@/lib/api/orval/api/generated/exercises/exercises";

export function useAvailableExerciseTypes() {
  const { data, isLoading } = useExercisesAvailableTypesRetrieve();

  return {
    availableTypes: data?.available_types ?? [],
    isLoading,
  };
}
