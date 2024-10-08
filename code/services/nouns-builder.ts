export class NounsBuilderService {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = "https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-ethereum-mainnet/stable/gn";
    }
  
    async getProposals(contractAddress: string, first: number = 100, skip: number = 0) {
      const query = `
        query proposals($where: Proposal_filter, $first: Int!, $skip: Int) {
          proposals(
            where: $where
            first: $first
            skip: $skip
            orderBy: timeCreated
            orderDirection: desc
          ) {
            ...Proposal
            votes {
              ...ProposalVote
            }
          }
        }
        fragment Proposal on Proposal {
          abstainVotes
          againstVotes
          calldatas
          description
          descriptionHash
          executableFrom
          expiresAt
          forVotes
          proposalId
          proposalNumber
          proposalThreshold
          proposer
          quorumVotes
          targets
          timeCreated
          title
          values
          voteEnd
          voteStart
          snapshotBlockNumber
          transactionHash
          dao {
            governorAddress
            tokenAddress
          }
        }
        fragment ProposalVote on ProposalVote {
          voter
          support
          weight
          reason
        }
      `;
  
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: {
              where: { dao: contractAddress },
              first,
              skip,
            },
            operationName: "proposals",
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching proposals: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Failed to fetch data from NounsBuilder API: ${error}`);
        throw new Error('Error fetching proposals');
      }
    }
}