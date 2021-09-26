import { getColonyNetworkClient, ColonyNetworkClient, Network, ColonyClient, getBlockTime, getLogs } from '@colony/colony-js';
import { Observable } from 'rxjs';
import { Wallet } from 'ethers';
import { InfuraProvider, Log } from 'ethers/providers';
import { utils } from 'ethers';
import { LogDescription } from 'ethers/utils/interface';

class EventsService {
    private MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
    private MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

    colonyClient!: ColonyClient;
    provider!: InfuraProvider;
    private isInitialized = false;

    public initialize(): Observable<void> {
        return new Observable<void>(observer => {
            this.provider = new InfuraProvider();
            const wallet = Wallet.createRandom();
            const connectedWallet = wallet.connect(this.provider);

            const getColonyClientCB = (colonyClient: ColonyClient) => {
                this.colonyClient = colonyClient;
                this.isInitialized = true;

                observer.next();
                observer.complete();
            }

            const errorCB = (error: any) => {
                this.isInitialized = false;
                observer.error(error);
                observer.complete();
            }

            const networkClient: ColonyNetworkClient = getColonyNetworkClient(Network.Mainnet, connectedWallet, { networkAddress: this.MAINNET_NETWORK_ADDRESS })

            networkClient.getColonyClient(this.MAINNET_BETACOLONY_ADDRESS)
                .then(getColonyClientCB)
                .catch(errorCB);
        });
    }

    public getLogs(): Observable<LogDescription[]> {
        return new Observable<LogDescription[]>(observer => {
            if (!this.isInitialized) {
                observer.error('Client is not initialized.');
                observer.complete();

                return;
            }

            const eventFilter = this.colonyClient.filters.PayoutClaimed(null, null, null);

            const getLogsCB = (eventLogs: Log[]) => {
                const parsedLogs = eventLogs.map(event => this.colonyClient.interface.parseLog(event));
                observer.next(parsedLogs);
                observer.complete();
            }

            const getLogsErrorCB = (error: string) => {
                observer.error(error);
                observer.complete();
            }

            getLogs(this.colonyClient, eventFilter)
                .then(getLogsCB)
                .catch(getLogsErrorCB);
        });
    }

    public getUserAddress(log: LogDescription): Observable<string> {
        return new Observable<string>(observer => {
            if (!this.isInitialized) {
                observer.error('Client is not initialized.');
                observer.complete();

                return;
            }

            const humanReadableFundingPotId = new utils.BigNumber(log.values.fundingPotId).toString();

            const errorCB = (error: string) => {
                observer.error(error);
                observer.complete();
            }

            const getFundingPotCB = (fundingPot: any) => {
                const { associatedTypeId } = fundingPot;

                const getPaymentCB = (payment: any) => {
                    const { recipient: userAddress } = payment;
                    observer.next(userAddress);
                    observer.complete();
                }

                this.colonyClient.getPayment(associatedTypeId)
                    .then(getPaymentCB)
                    .catch(errorCB);
            }

            this.colonyClient.getFundingPot(humanReadableFundingPotId)
                .then(getFundingPotCB)
                .catch(errorCB);
        });
    }

    public getTime(log: any): Observable<number> {
        return new Observable<number>(observer => {
            if (!this.isInitialized) {
                observer.error('Client is not initialized.');
                observer.complete();

                return;
            }

            const getBlockTimeCB = (logTime: number) => {
                observer.next(logTime);
                observer.complete();
            }

            const errorCB = (error: string) => {
                observer.error(error);
                observer.complete();
            }

            getBlockTime(this.provider, log.blockHash)
                .then(getBlockTimeCB)
                .catch(errorCB);
        });
    }
}

export const eventsService = new EventsService();
