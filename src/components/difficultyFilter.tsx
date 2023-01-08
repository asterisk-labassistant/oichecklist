// @ts-nocheck
import { Select } from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { Box, Text } from "@chakra-ui/react";

import { useAtom } from "jotai";
import { useState } from "react";

import filterTags from "../data/filter_tags.json";
import {
  problemsAtom,
  filterTopicsAtom,
  filterDifficultyAtom,
} from "../utils/store";

import problems from "../data/problem_data.json";

function toPascalCase(s: string) {
  return `${s}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

const filterDifficultyOptions = Object.entries(filterTags.difficulty).map(
  ([tag, occ], j) => ({
    label: `${toPascalCase(tag)} (${occ})`,
    value: tag,
  })
);

const DifficultyFilterMenu = () => {
  const [_, setProblems] = useAtom(problemsAtom);
  const [filterTopics] = useAtom(filterTopicsAtom);
  const [filterDifficulties, setFilterDifficulty] =
    useAtom(filterDifficultyAtom);
  const [value, setValue] = useState<string[]>([]);

  return (
    <Box>
      <Text my={1} fontSize="sm" fontWeight="bold">
        By Difficulty
      </Text>
      <MultiSelect
        onChange={(_value) => {
          const _difficulty =
            _value.length === 0
              ? filterDifficultyOptions.map((option) => option.value)
              : _value;
          setProblems({
            sections: problems.sections.map((section) => ({
              ...section,
              problems: section.problems.filter(
                (problem) =>
                  problem.tags.some((tag) => filterTopics.includes(tag)) &&
                  _difficulty.includes(problem.difficulty)
              ),
            })),
          });
          setFilterDifficulty(_difficulty);
          setValue(_value);
        }}
        value={value}
        // label="Filter Difficulty"
        backgroundColor="black"
        textColor="black"
        options={filterDifficultyOptions}
      />
    </Box>
  );
};

export default DifficultyFilterMenu;
