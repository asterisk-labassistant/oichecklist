import { type NextPage } from "next";
import { useRouter } from "next/router";

import { Flex, Box, Grid, GridItem, Text } from "@chakra-ui/react";
import GridLoader from "react-spinners/GridLoader";

import Layout from "../../components/layout";
import ProblemViewBox from "../../components/problemViewBox";

import problems from "../../data/problem_data.json";
import ProblemCounts from "../../components/problemCounts";

import { type Problem, AttemptingState } from "../../types/problem-data";

import { trpc } from "../../utils/trpc";
import ProgressBar from "../../components/progressBar";
import { useAtom } from "jotai";
import { problemsAtom } from "../../utils/store";

const ViewPage: NextPage = () => {
  const [problems] = useAtom(problemsAtom);
  const router = useRouter();
  const { userId } = router.query;

  const { isLoading, data, isError } = trpc.view.getGrid.useQuery({
    userId: userId ? userId.toString() : "",
  });

  if (isLoading)
    return (
      <Layout title="Problems">
        <Flex minH="100vh" alignItems="center" justifyContent="center">
          <GridLoader color="#172237" size={20} />
        </Flex>
      </Layout>
    );

  if (isError)
    return (
      <Layout title="Problems">
        <Flex minH="100vh" alignItems="center" justifyContent="center">
          {/* <GridLoader color="#172237" size={20} /> */}
          <div>This user does not exist.</div>
        </Flex>
      </Layout>
    );

  // if (isError) return <div>Error in loading data</div>;
  return (
    <Layout title="Problems">
      <Flex justifyContent="space-between">
        <Text
          ml={16}
          mt={8}
          fontSize="4xl"
          fontWeight="bold"
          color="gray.700"
          userSelect="none"
        >{`${data?.user?.name}'s Checklist`}</Text>
        <ProblemCounts userId={userId as string} />
      </Flex>
      <Box p={8} pt={0}>
        {problems.sections.map(({ sectionName, years }, i) => (
          <Box
            p={8}
            pt={2}
            borderBottomColor="gray.100"
            borderBottomStyle="solid"
            borderBottomWidth={2}
            key={i}
          >
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              {sectionName}
            </Text>

            <ProgressBar olympiad={sectionName} userId={userId as string} />

            <Grid
              templateColumns="100px auto"
              gap="1px"
              p="1px"
              background="gray.100"
              my={4}
              overflowX="auto"
            >
              {years.map((year, j) => {
                return (
                  [<GridItem key={j} background ="white" rowStart={j+1}>
                    <Flex
                      position="relative"
                      userSelect="none"
                      height="100%"
                      width="100%"
                      alignItems="center"
                      justifyContent="center"
                      zIndex={1}
                      p={3}
                      bgColor="rgba(234, 234, 234, 0.17)"
                    >
                      <Text
                        fontSize="14px"
                        textAlign="center"
                        fontWeight="bold">
                        {year.year}
                      </Text>
                    </Flex>
                    
                  </GridItem>,
                  year.problems.map((problem, k) => {
                    const userP = data?.userProbs.find(
                      (obj) => obj.problemSlug === problem.slug
                    );
    
                    let initAS = AttemptingState.Untouched;
                    if (userP) {
                      initAS = userP.attemptingState as AttemptingState;
                    }
    
                    return (
                      <GridItem background="white" key={k} rowStart={j+1}>
                        <ProblemViewBox
                          initAttemptingState={initAS}
                          problem={problem as Problem}
                          olympiadName={sectionName}
                        />
                      </GridItem>
                    );
                  })
                  ]
                )
              })}
            </Grid>
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default ViewPage;
